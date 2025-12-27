import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import MobileLayout from "../layout/MobileLayout";

export default function Absensi() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [countdown, setCountdown] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  /* ================= JAM REALTIME ================= */
  useEffect(() => {
    const timer = setInterval(
      () => setCurrentTime(new Date()),
      1000
    );
    return () => clearInterval(timer);
  }, []);

  /* ================= LOAD STATUS ================= */
  const loadStatus = async () => {
    try {
      const res = await api.get("/absensi/today");
      setStatus(res.data);
    } catch {
      setError("Gagal memuat status absensi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
    startCamera();
    return () => stopCamera();
  }, []);

  /* ================= CAMERA ================= */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setError("Tidak dapat mengakses kamera");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
  };

  /* ================= CAPTURE ================= */
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        "image/jpeg",
        0.9
      );
    });
  };

  /* ================= COUNTDOWN ================= */
  useEffect(() => {
    if (countdown === 0 && pendingAction) {
      absen(pendingAction);
      setCountdown(null);
      setPendingAction(null);
    }

    if (countdown > 0) {
      const timer = setTimeout(
        () => setCountdown(countdown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [countdown, pendingAction]);

  const startCountdown = (aksi) => {
    setPendingAction(aksi);
    setCountdown(10);
  };

  /* ================= SUBMIT ABSEN ================= */
  const absen = async (aksi) => {
    try {
      setSubmitting(true);
      setError("");

      const jam = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const fotoBlob = await capturePhoto();

      const formData = new FormData();
      formData.append("aksi", aksi);
      formData.append("jam", jam);
      formData.append("foto", fotoBlob, "absen.jpg");

      await api.post("/absensi", formData);
      await loadStatus();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Gagal menyimpan absensi"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MobileLayout title="Absensi">
        <p className="text-center text-gray-500">
          Loading...
        </p>
      </MobileLayout>
    );
  }

  const tanggalHariIni = currentTime.toLocaleDateString(
    "id-ID",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const jamSekarang = currentTime.toLocaleTimeString(
    "id-ID",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  );

  return (
    <MobileLayout title="Absensi">
      {error && (
        <div className="bg-red-100 text-red-600 p-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}

      {/* ================= WAKTU ================= */}
      <div className="bg-white rounded-xl p-3 mb-4 shadow text-center">
        <p className="text-sm text-gray-500">
          {tanggalHariIni}
        </p>
        <p className="text-xl font-bold text-blue-600">
          {jamSekarang}
        </p>
      </div>

      {/* ================= CAMERA ================= */}
      <div className="relative mb-4 rounded-xl overflow-hidden bg-black shadow">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-64 object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {countdown !== null && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-white text-6xl font-bold">
              {countdown}
            </div>
          </div>
        )}
      </div>

      {/* ================= STATUS ================= */}
      <div className="bg-white rounded-xl p-4 shadow mb-4">
        <p className="text-sm font-semibold mb-2">
          STATUS HARI INI
        </p>

        <div className="text-sm text-gray-600 space-y-1">
          <p>Masuk: {status?.jam_masuk || "--:--"}</p>
          <p>Istirahat: {status?.istirahat_mulai || "--:--"}</p>
          <p>Selesai: {status?.istirahat_selesai || "--:--"}</p>
          <p>Pulang: {status?.jam_pulang || "--:--"}</p>
        </div>
      </div>

      {/* ================= BUTTONS ================= */}
      <div className="space-y-3">
        {!status?.jam_masuk && (
          <button
            onClick={() => startCountdown("masuk")}
            disabled={submitting || countdown !== null}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
          >
            Absen Masuk (Foto Otomatis)
          </button>
        )}

        {status?.jam_masuk &&
          !status?.istirahat_mulai && (
            <button
              onClick={() =>
                startCountdown("istirahat_mulai")
              }
              disabled={submitting || countdown !== null}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
            >
              Mulai Istirahat
            </button>
          )}

        {status?.istirahat_mulai &&
          !status?.istirahat_selesai && (
            <button
              onClick={() =>
                startCountdown("istirahat_selesai")
              }
              disabled={submitting || countdown !== null}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
            >
              Selesai Istirahat (Foto)
            </button>
          )}

        {status?.istirahat_selesai &&
          !status?.jam_pulang && (
            <button
              onClick={() => startCountdown("pulang")}
              disabled={submitting || countdown !== null}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
            >
              Absen Pulang (Foto Otomatis)
            </button>
          )}
      </div>
    </MobileLayout>
  );
}
