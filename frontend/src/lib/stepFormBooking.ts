export type StepFormSnapshot = {
  eventType: string | null;
  firstName: string;
  lastName: string;
  inquiryEmail: string;
  phoneDialCode: string;
  phoneLocal: string;
  eventLocation: string | null;
  eventState: string | null;
  streetAddress: string;
  streetAddress2: string;
  addressCity: string;
  addressStateRegion: string;
  addressZip: string;
  addressCountry: string;
  eventDateMonth: string;
  eventDateDay: string;
  eventDateYear: string;
  eventDateIso: string;
  eventStartTime: string | null;
  otherFoodService: string | null;
  onlySweetsDessertOption: string | null;
  coiAnswer: string | null;
  eventDescription: string;
  approximateGuestCount: string;
  menuInterestOption: string | null;
  serveTimeWindowAnswer: string | null;
  serviceHoursOption: string | null;
  eventPayerOption: string | null;
  bookingInterestAnswer: string | null;
  quotedEventBasePrice: string;
};

export function getPublicBookingApiBase(): string {
  const env = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (env) return env.replace(/\/$/, "");
  if (typeof window !== "undefined" && window.location?.hostname) {
    return `${window.location.protocol}//127.0.0.1:8000/api/v1`;
  }
  return "http://127.0.0.1:8000/api/v1";
}

/** "11:30 PM" -> "23:30" for Laravel `date_format:H:i` */
export function amPmTo24Hour(timeStr: string | null): string | null {
  if (!timeStr) return null;
  const m = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = m[2];
  const ap = m[3].toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return `${h.toString().padStart(2, "0")}:${min}`;
}

export function serviceHoursToMinutes(opt: string | null): number {
  if (!opt || opt === "other") return 120;
  const n = parseFloat(opt);
  if (Number.isNaN(n)) return 120;
  const mins = Math.round(n * 60);
  return Math.min(480, Math.max(30, mins));
}

function firstValidationMessage(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const errors = (body as { errors?: Record<string, string[]> }).errors;
  if (!errors || typeof errors !== "object") return null;
  for (const key of Object.keys(errors)) {
    const arr = errors[key];
    if (Array.isArray(arr) && arr[0]) return arr[0];
  }
  return null;
}

export async function submitPublicBooking(payload: {
  event_date: string;
  event_time: string;
  duration_minutes: number;
  package_id: number;
  add_ons: { add_on_id: number; quantity: number }[];
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  event_address: string;
  special_notes: string | null;
  step_form_data: StepFormSnapshot;
}): Promise<{ message?: string }> {
  const base = getPublicBookingApiBase();
  const res = await fetch(`${base}/bookings`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = (await res.json().catch(() => ({}))) as {
    message?: string;
    errors?: Record<string, string[]>;
  };
  if (!res.ok) {
    const msg =
      firstValidationMessage(body) ||
      body.message ||
      `Booking failed (${res.status})`;
    throw new Error(msg);
  }
  return body;
}

export type PackageRow = { id: number; name: string; price: number; duration_minutes?: number };

export async function fetchActivePackages(): Promise<PackageRow[]> {
  const base = getPublicBookingApiBase();
  const res = await fetch(`${base}/packages`, { headers: { Accept: "application/json" } });
  const body = (await res.json().catch(() => ({}))) as { data?: PackageRow[] };
  if (!res.ok || !Array.isArray(body.data)) {
    throw new Error("Could not load packages from server.");
  }
  return body.data;
}

export function pickPackageIdForMenuInterest(
  packages: PackageRow[],
  menuInterest: string | null
): number {
  const premium = packages.find((p) => p.name === "Premium Party");
  const basic = packages.find((p) => p.name === "Basic Party");
  if (menuInterest === "full" && premium) return premium.id;
  if (menuInterest === "limited" && basic) return basic.id;
  return (basic ?? premium ?? packages[0]).id;
}
