"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

// Builds an HLS playlist URL from a Bunny Stream video asset id. If
// videoAssetId is already a full URL (e.g. a public demo/test stream used
// as seed data), use it as-is. Swap the Bunny branch out if you use Mux or
// Cloudflare Stream instead — only this function needs to change.
function hlsUrlFor(videoAssetId: string) {
  if (videoAssetId.startsWith("http")) return videoAssetId;
  const cdnHost = process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME;
  return `https://${cdnHost}/${videoAssetId}/playlist.m3u8`;
}

export default function Player({
  episodeId,
  videoAssetId,
  startPositionSeconds = 0,
}: {
  episodeId: string;
  videoAssetId: string;
  startPositionSeconds?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"checking-ad" | "ad" | "content">("checking-ad");
  const [adAsset, setAdAsset] = useState<string | null>(null);

  // Decide whether to play a pre-roll ad before loading the real content.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/ads/serve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ episodeId, breakPosition: "pre-roll" }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.shouldPlayAd) {
          setAdAsset(data.creative.videoAssetId);
          setPhase("ad");
        } else {
          setPhase("content");
        }
      })
      .catch(() => setPhase("content"));
    return () => {
      cancelled = true;
    };
  }, [episodeId]);

  const activeAssetId = phase === "ad" && adAsset ? adAsset : videoAssetId;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || phase === "checking-ad") return;

    const src = hlsUrlFor(activeAssetId);

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }
  }, [activeAssetId, phase]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || phase !== "content" || !startPositionSeconds) return;
    const onLoaded = () => {
      video.currentTime = startPositionSeconds;
    };
    video.addEventListener("loadedmetadata", onLoaded);
    return () => video.removeEventListener("loadedmetadata", onLoaded);
  }, [phase, startPositionSeconds]);

  function handleAdEnded() {
    setPhase("content");
  }

  // Periodically save watch progress once real content is playing.
  useEffect(() => {
    if (phase !== "content") return;
    const video = videoRef.current;
    if (!video) return;
    const interval = setInterval(() => {
      if (video.currentTime > 0) {
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ episodeId, positionSeconds: Math.floor(video.currentTime) }),
        }).catch(() => {});
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [phase, episodeId]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {phase === "checking-ad" ? (
        <div className="absolute inset-0 flex items-center justify-center text-sand-dim font-mono text-sm">
          Loading…
        </div>
      ) : (
        <video
          ref={videoRef}
          controls={phase === "content"}
          autoPlay
          className="w-full h-full"
          onEnded={phase === "ad" ? handleAdEnded : undefined}
        />
      )}
      {phase === "ad" && (
        <span className="absolute top-3 left-3 bg-night/80 text-ochre-bright text-xs font-mono px-2 py-1 rounded">
          Ad
        </span>
      )}
    </div>
  );
}
