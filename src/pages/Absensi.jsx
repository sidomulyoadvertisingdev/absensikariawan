import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import MobileLayout from "../layout/MobileLayout";

export default function Absensi() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  /**
   * ===============================
   * LOAD STATUS ABSENSI
   * ===============================
   */
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

  /**
   * ===============================
   * START / STOP CAMERA
   * ===============================
   */
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
    } catch (err) {
      setError("Tidak dapat mengakses kamera");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
  };

  /**
   * ===============================
   * CAPTURE FOTO DARI CAMERA
   * ===============================
   */
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

  /**
   * ===============================
   * SUBMIT ABSENSI
   * ===============================
   */
  const absen = async (aksi) => {
    try {
      setSubmitting(true);
      setError("");

      const now = new Date();
      const jam = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const fotoBlob = await capturePhoto();

      const formData = new FormData();
      formData.append("aksi", aksi);
      formData.append("jam", jam);
      formData.append("foto", fotoBlob, "absen.jpg");

      await api.post("/absensi", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await loadStatus();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan absensi");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * ===============================
   * LOADING
   * ===============================
   */
  if (loading) {
    return (
      <MobileLayout title="Absensi">
        <p className="text-center text-gray-500">Loading...</p>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Absensi">
      {error && (
        <div className="bg-red-100 text-red-600 p-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}

      {/* CAMERA PREVIEW */}
      <div className="mb-4 rounded-xl overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-64 object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* STATUS */}
      <div className="bg-white rounded-xl p-4 shadow mb-4">
        <p className="text-sm text-gray-500">Status Hari Ini</p>
        <p className="font-bold capitalize">
          {(status?.status || "belum_absen").replace("_", " ")}
        </p>

        <div className="text-xs text-gray-400 mt-1">
          {status?.jam_masuk && <p>Masuk: {status.jam_masuk}</p>}
          {status?.istirahat_mulai && (
            <p>Istirahat: {status.istirahat_mulai}</p>
          )}
          {status?.istirahat_selesai && (
            <p>Selesai: {status.istirahat_selesai}</p>
          )}
          {status?.jam_pulang && <p>Pulang: {status.jam_pulang}</p>}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="space-y-3">
        {!status?.jam_masuk && (
          <button
            onClick={() => absen("masuk")}
            disabled={submitting}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold"
          >
            Absen Masuk (Foto)
          </button>
        )}

        {status?.jam_masuk && !status?.istirahat_mulai && (
          <button
            onClick={() => absen("istirahat_mulai")}
            disabled={submitting}
            className="w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold"
          >
            Mulai Istirahat
          </button>
        )}

        {status?.istirahat_mulai && !status?.istirahat_selesai && (
          <button
            onClick={() => absen("istirahat_selesai")}
            disabled={submitting}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold"
          >
            Selesai Istirahat (Foto)
          </button>
        )}

        {status?.istirahat_selesai && !status?.jam_pulang && (
          <button
            onClick={() => absen("pulang")}
            disabled={submitting}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold"
          >
            Absen Pulang (Foto)
          </button>
        )}
      </div>
    </MobileLayout>
  );
}
