"use client";
import { useEffect, useState } from "react";

export default function EnablePush() {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setEnabled(false); return;
      }
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      setEnabled(!!sub);
    })();
  }, []);

  async function enable() {
    const reg = await navigator.serviceWorker.ready;
    const vapidKey = (await fetch("/api/push/subscribe", { method:"POST", body: JSON.stringify({ subscription:null })})).ok // just to hint route exists
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || (await (await fetch("/api/push/subscribe", { method:"POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ subscription: null, prefs: {} }) })).json()).publicKey; // fallback
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(publicKey) });
    await fetch("/api/push/subscribe", {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ subscription: sub.toJSON(), prefs: { morningOn: true, afternoonOn: true, eveningOn: true } })
    });
    setEnabled(true);
  }

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
  }

  if (enabled === null) return null;

  return enabled ? (
    <div className="text-sm text-green-700">Notifikasi aktif ✓</div>
  ) : (
    <button onClick={enable} className="text-sm px-3 py-2 rounded-xl border">Aktifkan Notifikasi</button>
  );
}