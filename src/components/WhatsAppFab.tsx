import { WhatsAppIcon } from "@/components/icons";
import { store } from "@/lib/config";
import { whatsappLink } from "@/lib/format";

/** Floating WhatsApp button on desktop; on mobile the bottom nav carries it. */
export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink(store.whatsapp, "سلام، از ویب سایت آسودا پیام می دهم.")}
      target="_blank"
      rel="noopener"
      aria-label="پیام در واتساپ"
      className="fixed bottom-6 end-6 z-40 hidden size-14 place-items-center rounded-full bg-wa text-white shadow-lg shadow-black/15 transition hover:scale-105 md:grid"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
