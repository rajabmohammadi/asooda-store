import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-4 py-24 text-center">
      <h1 className="mb-2 text-2xl font-extrabold">این صفحه پیدا نشد</h1>
      <p className="mb-6 text-muted">شاید آدرس اشتباه است یا جنس دیگر موجود نیست.</p>
      <Link href="/" className="rounded-xl bg-brand px-6 py-2.5 font-bold text-white">
        برگشت به خانه
      </Link>
    </div>
  );
}
