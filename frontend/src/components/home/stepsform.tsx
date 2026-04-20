"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { Check, ChevronDown, ChevronUp, Clock, Search, X } from "lucide-react";
import {
  amPmTo24Hour,
  fetchActivePackages,
  pickPackageIdForMenuInterest,
  serviceHoursToMinutes,
  submitPublicBooking,
  type StepFormSnapshot,
} from "@/src/lib/stepFormBooking";

const TOTAL_STEPS = 22;
/** Welcome + disclaimer; numbered “Step 1 of …” starts at the first question (internal step 3). */
const INTRO_STEPS = 2;
const QUESTION_STEPS = TOTAL_STEPS - INTRO_STEPS;

function formatHalfHourSlot(h: number, m: number): string {
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

const TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30] as const) {
      slots.push(formatHalfHourSlot(h, m));
    }
  }
  return slots;
})();

function isValidEventDate(
  monthStr: string,
  dayStr: string,
  yearStr: string
): boolean {
  const m = parseInt(monthStr, 10);
  const d = parseInt(dayStr, 10);
  const y = parseInt(yearStr, 10);
  if (Number.isNaN(m) || Number.isNaN(d) || Number.isNaN(y)) return false;
  if (m < 1 || m > 12 || d < 1 || d > 31 || y < 2000 || y > 2100) return false;
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

function isAddressStepComplete(
  line1: string,
  city: string,
  region: string,
  zip: string
): boolean {
  return (
    line1.trim().length > 0 &&
    city.trim().length > 0 &&
    region.trim().length > 0 &&
    zip.trim().length > 0
  );
}

function formatQuotedEventBasePrice(
  _guestCount: string,
  _menuInterest: string | null,
  _serviceHours: string | null
): string {
  return "$0";
}

/** US state names for event location step (searchable dropdown). */
const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
] as const;

const PHONE_DIAL_OPTIONS = [
  { dial: "+1", flag: "🇺🇸", label: "United States" },
  { dial: "+44", flag: "🇬🇧", label: "United Kingdom" },
  { dial: "+92", flag: "🇵🇰", label: "Pakistan" },
] as const;

function isValidInquiryEmail(value: string): boolean {
  const t = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

function phoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function isValidPhoneLocal(dialCode: string, local: string): boolean {
  const n = phoneDigits(local).length;
  if (dialCode === "+1") return n >= 10;
  return n >= 8;
}

const EVENT_TYPE_OPTIONS = [
  {
    value: "personal",
    letter: "A",
    label: "Personal or Family Celebration",
  },
  {
    value: "corporate",
    letter: "B",
    label: "Corporate Event",
  },
  {
    value: "community",
    letter: "C",
    label: "Community/Public Event",
  },
] as const;

const EVENT_LOCATION_OPTIONS = [
  { value: "home", letter: "A", label: "Personal Home" },
  { value: "office", letter: "B", label: "Office Building" },
  { value: "venue", letter: "C", label: "Venue or Restaurant" },
  { value: "public", letter: "D", label: "Public Space" },
  { value: "other", letter: "E", label: "Other" },
] as const;

const OTHER_FOOD_SERVICE_OPTIONS = [
  { value: "yes", letter: "A", label: "Yes" },
  { value: "no", letter: "B", label: "No" },
] as const;

const ONLY_SWEETS_DESSERT_OPTIONS = [
  { value: "yes", letter: "A", label: "Yes" },
  { value: "no", letter: "B", label: "No" },
] as const;

const MENU_INTEREST_OPTIONS = [
  {
    value: "full",
    letter: "A",
    label: "Full Menu - $9 per person",
  },
  {
    value: "limited",
    letter: "B",
    label: "Limited Menu - $8 per person",
  },
] as const;

const SERVE_TIME_WINDOW_OPTIONS = [
  { value: "yes", letter: "Y", label: "Yes" },
  { value: "no", letter: "N", label: "No" },
] as const;

const BOOKING_INTEREST_OPTIONS = SERVE_TIME_WINDOW_OPTIONS;

const SERVICE_HOURS_OPTIONS = [
  { value: "1", letter: "A", label: "1" },
  { value: "1.5", letter: "B", label: "1.5" },
  { value: "2", letter: "C", label: "2" },
  { value: "2.5", letter: "D", label: "2.5" },
  { value: "3", letter: "E", label: "3" },
  { value: "3.5", letter: "F", label: "3.5" },
  { value: "4", letter: "G", label: "4" },
  { value: "other", letter: "H", label: "Other" },
] as const;

const EVENT_PAYER_OPTIONS = [
  { value: "individual", letter: "A", label: "An Individual" },
  { value: "company", letter: "B", label: "Company or Organization" },
  {
    value: "attendees",
    letter: "C",
    label: "Attendees (Pay Per Person)",
  },
] as const;

const COI_OPTIONS = [
  { value: "yes", letter: "A", label: "Yes" },
  { value: "no", letter: "B", label: "No" },
  { value: "unsure", letter: "C", label: "I'm not sure" },
] as const;

export type StepsFormProps = {
  open: boolean;
  onClose: () => void;
};

export default function StepsForm({ open, onClose }: StepsFormProps) {
  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [phoneDialCode, setPhoneDialCode] = useState<string>("+1");
  const [phoneLocal, setPhoneLocal] = useState("");
  const [eventLocation, setEventLocation] = useState<string | null>(null);
  const [eventState, setEventState] = useState<string | null>(null);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [stateSearch, setStateSearch] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [streetAddress2, setStreetAddress2] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressStateRegion, setAddressStateRegion] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [addressCountry, setAddressCountry] = useState("United States");
  const [eventDateMonth, setEventDateMonth] = useState("");
  const [eventDateDay, setEventDateDay] = useState("");
  const [eventDateYear, setEventDateYear] = useState("");
  const [eventStartTime, setEventStartTime] = useState<string | null>(null);
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [timeSearch, setTimeSearch] = useState("");
  const [otherFoodService, setOtherFoodService] = useState<string | null>(null);
  const [onlySweetsDessertOption, setOnlySweetsDessertOption] = useState<
    string | null
  >(null);
  const [coiAnswer, setCoiAnswer] = useState<string | null>(null);
  const [eventDescription, setEventDescription] = useState("");
  const [approximateGuestCount, setApproximateGuestCount] = useState("");
  const [menuInterestOption, setMenuInterestOption] = useState<string | null>(
    null
  );
  const [serveTimeWindowAnswer, setServeTimeWindowAnswer] = useState<
    string | null
  >(null);
  const [serviceHoursOption, setServiceHoursOption] = useState<string | null>(
    null
  );
  const [eventPayerOption, setEventPayerOption] = useState<string | null>(null);
  const [bookingInterestAnswer, setBookingInterestAnswer] = useState<
    string | null
  >(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const eventTypeRef = useRef<string | null>(null);
  const stateComboboxRef = useRef<HTMLDivElement>(null);
  const timeComboboxRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef("");
  const lastNameRef = useRef("");
  const inquiryEmailRef = useRef("");
  const phoneLocalRef = useRef("");
  const eventLocationRef = useRef<string | null>(null);
  const eventStateRef = useRef<string | null>(null);
  const eventStartTimeRef = useRef<string | null>(null);
  const otherFoodServiceRef = useRef<string | null>(null);
  const onlySweetsDessertOptionRef = useRef<string | null>(null);
  const coiAnswerRef = useRef<string | null>(null);
  const approximateGuestCountRef = useRef("");
  const menuInterestOptionRef = useRef<string | null>(null);
  const serveTimeWindowAnswerRef = useRef<string | null>(null);
  const serviceHoursOptionRef = useRef<string | null>(null);
  const eventPayerOptionRef = useRef<string | null>(null);
  const bookingInterestAnswerRef = useRef<string | null>(null);
  const inquiryFormRef = useRef<HTMLFormElement>(null);
  eventTypeRef.current = eventType;
  firstNameRef.current = firstName;
  lastNameRef.current = lastName;
  inquiryEmailRef.current = inquiryEmail;
  phoneLocalRef.current = phoneLocal;
  eventLocationRef.current = eventLocation;
  eventStateRef.current = eventState;
  eventStartTimeRef.current = eventStartTime;
  otherFoodServiceRef.current = otherFoodService;
  onlySweetsDessertOptionRef.current = onlySweetsDessertOption;
  coiAnswerRef.current = coiAnswer;
  approximateGuestCountRef.current = approximateGuestCount.trim();
  menuInterestOptionRef.current = menuInterestOption;
  serveTimeWindowAnswerRef.current = serveTimeWindowAnswer;
  serviceHoursOptionRef.current = serviceHoursOption;
  eventPayerOptionRef.current = eventPayerOption;
  bookingInterestAnswerRef.current = bookingInterestAnswer;

  const quotedEventBasePrice = useMemo(
    () =>
      formatQuotedEventBasePrice(
        approximateGuestCount,
        menuInterestOption,
        serviceHoursOption
      ),
    [approximateGuestCount, menuInterestOption, serviceHoursOption]
  );

  useEffect(() => {
    if (open) {
      setStep(1);
      setEventType(null);
      setFirstName("");
      setLastName("");
      setInquiryEmail("");
      setPhoneDialCode("+1");
      setPhoneLocal("");
      setEventLocation(null);
      setEventState(null);
      setStateDropdownOpen(false);
      setStateSearch("");
      setStreetAddress("");
      setStreetAddress2("");
      setAddressCity("");
      setAddressStateRegion("");
      setAddressZip("");
      setAddressCountry("United States");
      setEventDateMonth("");
      setEventDateDay("");
      setEventDateYear("");
      setEventStartTime(null);
      setTimeDropdownOpen(false);
      setTimeSearch("");
      setOtherFoodService(null);
      setOnlySweetsDessertOption(null);
      setCoiAnswer(null);
      setEventDescription("");
      setApproximateGuestCount("");
      setMenuInterestOption(null);
      setServeTimeWindowAnswer(null);
      setServiceHoursOption(null);
      setEventPayerOption(null);
      setBookingInterestAnswer(null);
      setSubmitting(false);
      setSubmitError("");
    }
  }, [open]);

  useEffect(() => {
    if (!timeDropdownOpen) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const el = timeComboboxRef.current;
      if (el && !el.contains(e.target as Node)) {
        setTimeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [timeDropdownOpen]);

  useEffect(() => {
    if (step !== 12) setTimeDropdownOpen(false);
  }, [step]);

  useEffect(() => {
    if (!stateDropdownOpen) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const el = stateComboboxRef.current;
      if (el && !el.contains(e.target as Node)) {
        setStateDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [stateDropdownOpen]);

  useEffect(() => {
    if (step !== 9) setStateDropdownOpen(false);
  }, [step]);

  useEffect(() => {
    if (!open || step !== 3) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      const k = e.key.toLowerCase();
      if (k === "a") setEventType("personal");
      if (k === "b") setEventType("corporate");
      if (k === "c") setEventType("community");
      if (e.key === "Enter" && eventTypeRef.current) {
        e.preventDefault();
        setStep(4);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  useEffect(() => {
    if (!open || step !== 4) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      if (e.key === "Enter" && firstNameRef.current.trim()) {
        e.preventDefault();
        setStep(5);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  useEffect(() => {
    if (!open || step !== 5) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      if (e.key === "Enter" && lastNameRef.current.trim()) {
        e.preventDefault();
        setStep(6);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  useEffect(() => {
    if (!open || step !== 6) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      if (
        e.key === "Enter" &&
        isValidInquiryEmail(inquiryEmailRef.current)
      ) {
        e.preventDefault();
        setStep(7);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  useEffect(() => {
    if (!open || step !== 7) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      if (
        e.key === "Enter" &&
        isValidPhoneLocal(phoneDialCode, phoneLocalRef.current)
      ) {
        e.preventDefault();
        setStep(8);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step, phoneDialCode]);

  useEffect(() => {
    if (!open || step !== 8) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      const k = e.key.toLowerCase();
      if (k === "a") setEventLocation("home");
      if (k === "b") setEventLocation("office");
      if (k === "c") setEventLocation("venue");
      if (k === "d") setEventLocation("public");
      if (k === "e") setEventLocation("other");
      if (e.key === "Enter" && eventLocationRef.current) {
        e.preventDefault();
        setStep(9);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  useEffect(() => {
    if (!open || step !== 9) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      if (e.key === "Enter" && eventStateRef.current) {
        e.preventDefault();
        setStep(10);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  useEffect(() => {
    if (!open || step !== 10) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      if (
        e.key === "Enter" &&
        isAddressStepComplete(
          streetAddress,
          addressCity,
          addressStateRegion,
          addressZip
        )
      ) {
        e.preventDefault();
        setStep(11);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    open,
    step,
    streetAddress,
    addressCity,
    addressStateRegion,
    addressZip,
  ]);

  useEffect(() => {
    if (!open || step !== 11) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      if (
        e.key === "Enter" &&
        isValidEventDate(eventDateMonth, eventDateDay, eventDateYear)
      ) {
        e.preventDefault();
        setStep(12);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step, eventDateMonth, eventDateDay, eventDateYear]);

  useEffect(() => {
    if (!open || step !== 12) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      if (e.key === "Enter" && eventStartTimeRef.current) {
        e.preventDefault();
        setStep(13);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  useEffect(() => {
    if (!open || step !== 13) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      const k = e.key.toLowerCase();
      if (k === "a") setCoiAnswer("yes");
      if (k === "b") setCoiAnswer("no");
      if (k === "c") setCoiAnswer("unsure");
      if (e.key === "Enter" && coiAnswerRef.current) {
        e.preventDefault();
        setStep(14);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  useEffect(() => {
    if (!open || step !== 14) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      if (e.key === "Enter" && eventDescription.trim()) {
        e.preventDefault();
        setStep(15);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step, eventDescription]);

  useEffect(() => {
    if (!open || step !== 15) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      const k = e.key.toLowerCase();
      if (k === "a") setOtherFoodService("yes");
      if (k === "b") setOtherFoodService("no");
      if (e.key === "Enter" && otherFoodServiceRef.current) {
        e.preventDefault();
        setStep(16);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  useEffect(() => {
    if (!open || step !== 16) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      const k = e.key.toLowerCase();
      if (k === "a") setOnlySweetsDessertOption("yes");
      if (k === "b") setOnlySweetsDessertOption("no");
      if (e.key === "Enter" && onlySweetsDessertOptionRef.current) {
        e.preventDefault();
        setStep(17);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  useEffect(() => {
    if (!open || step !== 17) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      if (e.key === "Enter" && approximateGuestCountRef.current) {
        e.preventDefault();
        setStep(18);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step, approximateGuestCount]);

  useEffect(() => {
    if (!open || step !== 18) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      const k = e.key.toLowerCase();
      if (k === "a") setMenuInterestOption("full");
      if (k === "b") setMenuInterestOption("limited");
      if (e.key === "Enter" && menuInterestOptionRef.current) {
        e.preventDefault();
        setStep(19);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  useEffect(() => {
    if (!open || step !== 19) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      const k = e.key.toLowerCase();
      if (k === "y") setServeTimeWindowAnswer("yes");
      if (k === "n") setServeTimeWindowAnswer("no");
      if (e.key === "Enter" && serveTimeWindowAnswerRef.current) {
        e.preventDefault();
        setStep(20);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  useEffect(() => {
    if (!open || step !== 20) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      const k = e.key.toLowerCase();
      if (k === "a") setServiceHoursOption("1");
      if (k === "b") setServiceHoursOption("1.5");
      if (k === "c") setServiceHoursOption("2");
      if (k === "d") setServiceHoursOption("2.5");
      if (k === "e") setServiceHoursOption("3");
      if (k === "f") setServiceHoursOption("3.5");
      if (k === "g") setServiceHoursOption("4");
      if (k === "h") setServiceHoursOption("other");
      if (e.key === "Enter" && serviceHoursOptionRef.current) {
        e.preventDefault();
        setStep(21);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  useEffect(() => {
    if (!open || step !== 21) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      const k = e.key.toLowerCase();
      if (k === "a") setEventPayerOption("individual");
      if (k === "b") setEventPayerOption("company");
      if (k === "c") setEventPayerOption("attendees");
      if (e.key === "Enter" && eventPayerOptionRef.current) {
        e.preventDefault();
        setStep(22);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  useEffect(() => {
    if (!open || step !== 22) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      const k = e.key.toLowerCase();
      if (k === "y") setBookingInterestAnswer("yes");
      if (k === "n") setBookingInterestAnswer("no");
      if (e.key === "Enter" && bookingInterestAnswerRef.current) {
        e.preventDefault();
        inquiryFormRef.current?.requestSubmit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (step === 9 && stateDropdownOpen) {
        e.preventDefault();
        setStateDropdownOpen(false);
        return;
      }
      if (step === 12 && timeDropdownOpen) {
        e.preventDefault();
        setTimeDropdownOpen(false);
        return;
      }
      onClose();
    },
    [onClose, step, stateDropdownOpen, timeDropdownOpen]
  );

  const goPrev = useCallback(() => {
    if (step <= 1) return;
    if (step === 3) {
      setEventType(null);
      setStep(2);
      return;
    }
    if (step === 8) {
      setEventLocation(null);
      setStep(7);
      return;
    }
    if (step === 9) {
      setEventState(null);
      setStateDropdownOpen(false);
      setStateSearch("");
      setStep(8);
      return;
    }
    if (step === 12) {
      setEventStartTime(null);
      setTimeDropdownOpen(false);
      setTimeSearch("");
      setStep(11);
      return;
    }
    if (step === 13) {
      setCoiAnswer(null);
      setStep(12);
      return;
    }
    if (step === 14) {
      setStep(13);
      return;
    }
    if (step === 15) {
      setOtherFoodService(null);
      setStep(14);
      return;
    }
    if (step === 16) {
      setOnlySweetsDessertOption(null);
      setStep(15);
      return;
    }
    if (step === 17) {
      setStep(16);
      return;
    }
    if (step === 18) {
      setMenuInterestOption(null);
      setStep(17);
      return;
    }
    if (step === 19) {
      setServeTimeWindowAnswer(null);
      setStep(18);
      return;
    }
    if (step === 20) {
      setServiceHoursOption(null);
      setStep(19);
      return;
    }
    if (step === 21) {
      setEventPayerOption(null);
      setStep(20);
      return;
    }
    if (step === 22) {
      setBookingInterestAnswer(null);
      setStep(21);
      return;
    }
    setStep((s) => s - 1);
  }, [step]);

  const goNext = useCallback(() => {
    if (step >= TOTAL_STEPS) return;
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    if (step === 3) {
      if (!eventType) return;
      setStep(4);
      return;
    }
    if (step === 4) {
      if (!firstName.trim()) return;
      setStep(5);
      return;
    }
    if (step === 5) {
      if (!lastName.trim()) return;
      setStep(6);
      return;
    }
    if (step === 6) {
      if (!isValidInquiryEmail(inquiryEmail)) return;
      setStep(7);
      return;
    }
    if (step === 7) {
      if (!isValidPhoneLocal(phoneDialCode, phoneLocal)) return;
      setStep(8);
      return;
    }
    if (step === 8) {
      if (!eventLocation) return;
      setStep(9);
      return;
    }
    if (step === 9) {
      if (!eventState) return;
      setStep(10);
      return;
    }
    if (step === 10) {
      if (
        !isAddressStepComplete(
          streetAddress,
          addressCity,
          addressStateRegion,
          addressZip
        )
      )
        return;
      setStep(11);
      return;
    }
    if (step === 11) {
      if (!isValidEventDate(eventDateMonth, eventDateDay, eventDateYear))
        return;
      setStep(12);
      return;
    }
    if (step === 12) {
      if (!eventStartTime) return;
      setStep(13);
      return;
    }
    if (step === 13) {
      if (!coiAnswer) return;
      setStep(14);
      return;
    }
    if (step === 14) {
      if (!eventDescription.trim()) return;
      setStep(15);
      return;
    }
    if (step === 15) {
      if (!otherFoodService) return;
      setStep(16);
      return;
    }
    if (step === 16) {
      if (!onlySweetsDessertOption) return;
      setStep(17);
      return;
    }
    if (step === 17) {
      if (!approximateGuestCount.trim()) return;
      setStep(18);
      return;
    }
    if (step === 18) {
      if (!menuInterestOption) return;
      setStep(19);
      return;
    }
    if (step === 19) {
      if (!serveTimeWindowAnswer) return;
      setStep(20);
      return;
    }
    if (step === 20) {
      if (!serviceHoursOption) return;
      setStep(21);
      return;
    }
    if (step === 21) {
      if (!eventPayerOption) return;
      setStep(22);
      return;
    }
  }, [
    step,
    eventType,
    firstName,
    lastName,
    inquiryEmail,
    phoneDialCode,
    phoneLocal,
    eventLocation,
    eventState,
    streetAddress,
    addressCity,
    addressStateRegion,
    addressZip,
    eventDateMonth,
    eventDateDay,
    eventDateYear,
    eventStartTime,
    otherFoodService,
    onlySweetsDessertOption,
    coiAnswer,
    eventDescription,
    approximateGuestCount,
    menuInterestOption,
    serveTimeWindowAnswer,
    serviceHoursOption,
    eventPayerOption,
  ]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="steps-form-modal fixed inset-0 z-[200] flex min-h-dvh flex-col bg-white font-dmsans text-para-color "
      role="dialog"
      aria-modal="true"
      aria-labelledby={
        step === 1
          ? "steps-form-title"
          : step === 2
            ? "steps-form-step2-heading"
            : step === 3
              ? "steps-form-step3-heading"
              : step === 4
                ? "steps-form-step4-heading"
                : step === 5
                  ? "steps-form-step5-heading"
                  : step === 6
                    ? "steps-form-step6-heading"
                    : step === 7
                      ? "steps-form-step7-heading"
                      : step === 8
                        ? "steps-form-step8-heading"
                        : step === 9
                          ? "steps-form-step9-heading"
                          : step === 10
                            ? "steps-form-step10-heading"
                            : step === 11
                              ? "steps-form-step11-heading"
                              : step === 12
                                ? "steps-form-step12-heading"
                                : step === 13
                                  ? "steps-form-step13-heading"
                                  : step === 14
                                    ? "steps-form-step14-heading"
                                    : step === 15
                                      ? "steps-form-step15-heading"
                                      : step === 16
                                        ? "steps-form-step16-heading"
                                        : step === 17
                                          ? "steps-form-step17-heading"
                                          : step === 18
                                            ? "steps-form-step18-heading"
                                            : step === 19
                                              ? "steps-form-step19-heading"
                                              : step === 20
                                                ? "steps-form-step20-heading"
                                                : step === 21
                                                  ? "steps-form-step21-heading"
                                                  : "steps-form-step22-heading"
      }
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className="fixed right-4 top-4 z-[5] rounded-full p-2.5 text-[var(--para-color)] transition-colors hover:bg-neutral-100 hover:text-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] md:right-6 md:top-6"
        aria-label="Close inquiry form"
        onClick={onClose}
      >
        <X className="h-6 w-6" strokeWidth={2} />
      </button>

      <div
        className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-5 pb-36 pt-16 md:px-12 md:pb-44 md:pt-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`mx-auto flex w-full max-w-[560px] flex-1 flex-col py-6 md:py-10 ${
            step === 21 || step === 22 ? "justify-start" : "justify-center"
          }`}
        >

        {step === 1 && (
          <div className="flex flex-col items-center text-center pt-2">
            <h1
              id="steps-form-title"
              className="font-shine-bubble text-[clamp(1.75rem,5vw,2.25rem)] font-extrabold uppercase leading-tight tracking-wide text-[var(--secondary)]"
            >
              My Ice Cream Truck
            </h1>
            <p className="mt-6 max-w-[440px] text-[15px] leading-relaxed text-para-color  md:text-[16px]">
              Due to very high event demand, we kindly ask that you take 5
              minutes to complete this form so we can make the booking process as
              efficient as possible.
            </p>
            <p className="mt-4 max-w-[420px] text-[13px] leading-relaxed text-[var(--para-color)] md:text-[14px]">
              This is an event inquiry only. Filling out this form does not
              reserve a date. Availability is based on first come first serve
              basis.
            </p>
            <button
              type="button"
              className="btn btn-primary packages-page-tabs__btn mt-8 min-w-[200px] rounded-full px-10 py-4 text-[15px] font-bold text-[var(--text-on-brand)] !text-white"
              onClick={() => setStep(2)}
            >
              <span className="packages-page-tabs__btn__label">Let&apos;s Go!</span>
            </button>
            <p className="mt-6 flex items-center gap-2 text-[13px] text-[var(--para-color)]">
              <Clock className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              <span>Takes 3 minutes</span>
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center text-center pt-2">
            <h2
              id="steps-form-step2-heading"
              className="sr-only"
            >
              Before you continue
            </h2>
            <p className="max-w-[440px] text-[15px] leading-relaxed text-para-color  md:text-[16px]">
              Please do not fill out this form as a way to check availability for
              smaller events (under 100 guests).{" "}
              <strong className="font-semibold text-[var(--primary)]">
                Available dates and times are always up to date on our website
              </strong>{" "}
              and unfortunately we don&apos;t have the ability to offer waitlists
              at this time.
            </p>
            <p className="mt-8 text-[15px] text-[var(--grey)] md:text-[16px]">
              Thank you!
            </p>
            <button
              type="button"
              className="btn btn-primary packages-page-tabs__btn mt-10 min-w-[200px] rounded-full px-10 py-4 text-[15px] font-bold !text-white"
              onClick={() => setStep(3)}
            >
              <span className="packages-page-tabs__btn__label">Continue</span>
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="pt-2">
            <fieldset className="border-0 p-0 m-0">
              <legend className="mb-8 flex w-full items-start gap-3 px-0 text-left">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--secondary)] text-[15px] font-bold text-white"
                  aria-hidden
                >
                  1
                </span>
                <span
                  id="steps-form-step3-heading"
                  className="pt-0.5 text-[17px] font-semibold leading-snug text-para-color md:text-[18px]"
                >
                  What kind of event is this?
                  <abbr title="required" className="no-underline text-[var(--secondary)]">
                    *
                  </abbr>
                </span>
              </legend>

              <div
                className="flex flex-col gap-3"
                role="radiogroup"
                aria-labelledby="steps-form-step3-heading"
                aria-required="true"
              >
                {EVENT_TYPE_OPTIONS.map((opt) => {
                  const selected = eventType === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={[
                        "flex cursor-pointer items-stretch gap-3 rounded-[14px] border-2 bg-[color-mix(in_srgb,var(--secondary)_6%,#fff)] px-3 py-3 transition-[border-color,box-shadow] md:px-4 md:py-3.5",
                        selected
                          ? "border-[var(--secondary)] shadow-[0_0_0_1px_var(--secondary)]"
                          : "border-[color-mix(in_srgb,var(--secondary)_42%,transparent)]",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name="event-type"
                        value={opt.value}
                        checked={selected}
                        className="sr-only"
                        onChange={() => setEventType(opt.value)}
                      />
                      <span
                        className={[
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border-2 text-[15px] font-bold transition-colors",
                          selected
                            ? "border-[var(--secondary)] bg-[var(--secondary)] text-white"
                            : "border-[var(--secondary)] bg-white text-[var(--secondary)]",
                        ].join(" ")}
                        aria-hidden
                      >
                        {opt.letter}
                      </span>
                      <span className="flex min-w-0 flex-1 items-center text-left text-[15px] font-medium leading-snug text-para-color md:text-[16px]">
                        {opt.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="order-2 text-[14px] font-semibold text-[var(--primary)] underline-offset-2 hover:underline sm:order-1"
                  onClick={() => {
                    setEventType(null);
                    setStep(2);
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!eventType}
                  className="order-1 min-w-[140px] rounded-[13px] bg-[var(--secondary)] px-10 py-3.5 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(193,49,148,0.35)] transition-[opacity,transform] enabled:hover:scale-[1.02] enabled:hover:shadow-[0_8px_24px_rgba(193,49,148,0.45)] disabled:cursor-not-allowed disabled:opacity-45 sm:order-2"
                  onClick={() => setStep(4)}
                >
                  OK
                </button>
              </div>
            </fieldset>
          </div>
        )}

        {step === 4 && (
          <div className="pt-2 text-left">
            <div className="mb-8 flex w-full items-start gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--secondary)] text-[15px] font-bold text-white"
                aria-hidden
              >
                2
              </span>
              <label
                id="steps-form-step4-heading"
                htmlFor="steps-first-name"
                className="cursor-pointer pt-0.5 text-[17px] font-semibold leading-snug text-para-color  md:text-[18px]"
              >
                Your First Name
                <abbr
                  title="required"
                  className="no-underline text-[var(--secondary)]"
                >
                  *
                </abbr>
              </label>
            </div>
            <input
              id="steps-first-name"
              name="first-name-field"
              type="text"
              autoComplete="given-name"
              autoFocus
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Type here"
              className="w-full border-0 border-b-2 border-[var(--secondary)] bg-transparent py-2.5 text-[17px] text-[var(--secondary)] caret-[var(--secondary)] placeholder:text-[color-mix(in_srgb,var(--secondary)_45%,#0a2a5c)] focus:border-[var(--secondary)] focus:outline-none md:text-[18px]"
            />
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="order-2 text-[14px] font-semibold text-[var(--primary)] underline-offset-2 hover:underline sm:order-1"
                onClick={() => setStep(3)}
              >
                Back
              </button>
              <button
                type="button"
                disabled={!firstName.trim()}
                className="order-1 self-start rounded-[10px] bg-[var(--secondary)] px-10 py-3 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(193,49,148,0.35)] transition-[opacity,transform] enabled:hover:scale-[1.02] enabled:hover:shadow-[0_8px_24px_rgba(193,49,148,0.45)] disabled:cursor-not-allowed disabled:opacity-45 sm:order-2"
                onClick={() => {
                  if (!firstName.trim()) return;
                  setStep(5);
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="pt-2 text-left">
            <div className="mb-8 flex w-full items-start gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--secondary)] text-[15px] font-bold text-white"
                aria-hidden
              >
                3
              </span>
              <label
                id="steps-form-step5-heading"
                htmlFor="steps-last-name"
                className="cursor-pointer pt-0.5 text-[17px] font-semibold leading-snug text-para-color  md:text-[18px]"
              >
                Last Name
                <abbr
                  title="required"
                  className="no-underline text-[var(--secondary)]"
                >
                  *
                </abbr>
              </label>
            </div>
            <input
              id="steps-last-name"
              name="last-name-field"
              type="text"
              autoComplete="family-name"
              autoFocus
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full border-0 border-b-2 border-[var(--secondary)] bg-transparent py-2.5 text-[17px] text-[var(--secondary)] caret-[var(--secondary)] placeholder:text-[color-mix(in_srgb,var(--secondary)_38%,#0a2a5c)] focus:border-[var(--secondary)] focus:outline-none md:text-[18px]"
            />
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="order-2 text-[14px] font-semibold text-[var(--primary)] underline-offset-2 hover:underline sm:order-1"
                onClick={() => setStep(4)}
              >
                Back
              </button>
              <button
                type="button"
                disabled={!lastName.trim()}
                className="order-1 self-start rounded-[10px] bg-[var(--secondary)] px-10 py-3 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(193,49,148,0.35)] transition-[opacity,transform] enabled:hover:scale-[1.02] enabled:hover:shadow-[0_8px_24px_rgba(193,49,148,0.45)] disabled:cursor-not-allowed disabled:opacity-45 sm:order-2"
                onClick={() => {
                  if (!lastName.trim()) return;
                  setStep(6);
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="pt-2 text-left">
            <div className="mb-8 flex w-full items-start gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--secondary)] text-[15px] font-bold text-white"
                aria-hidden
              >
                4
              </span>
              <label
                id="steps-form-step6-heading"
                htmlFor="steps-inquiry-email-inline"
                className="cursor-pointer pt-0.5 text-[17px] font-semibold leading-snug text-para-color  md:text-[18px]"
              >
                Email Address
                <abbr
                  title="required"
                  className="no-underline text-[var(--secondary)]"
                >
                  *
                </abbr>
              </label>
            </div>
            <input
              id="steps-inquiry-email-inline"
              name="email-field"
              type="email"
              autoComplete="email"
              autoFocus
              value={inquiryEmail}
              onChange={(e) => setInquiryEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full border-0 border-b border-neutral-300 bg-transparent py-2.5 text-[17px] text-para-color  caret-[var(--secondary)] placeholder:text-[color-mix(in_srgb,var(--secondary)_45%,#94a3b8)] focus:border-[var(--secondary)] focus:outline-none md:text-[18px]"
            />
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="order-2 text-[14px] font-semibold text-[var(--primary)] underline-offset-2 hover:underline sm:order-1"
                onClick={() => setStep(5)}
              >
                Back
              </button>
              <button
                type="button"
                disabled={!isValidInquiryEmail(inquiryEmail)}
                className="order-1 self-start rounded-[10px] bg-[var(--secondary)] px-10 py-3 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(193,49,148,0.35)] transition-[opacity,transform] enabled:hover:scale-[1.02] enabled:hover:shadow-[0_8px_24px_rgba(193,49,148,0.45)] disabled:cursor-not-allowed disabled:opacity-45 sm:order-2"
                onClick={() => {
                  if (!isValidInquiryEmail(inquiryEmail)) return;
                  setStep(7);
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="pt-2 text-left">
            <div className="mb-8 flex w-full items-start gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--secondary)] text-[15px] font-bold text-white"
                aria-hidden
              >
                5
              </span>
              <label
                id="steps-form-step7-heading"
                htmlFor="steps-mobile-local"
                className="cursor-pointer pt-0.5 text-[17px] font-semibold leading-snug text-para-color  md:text-[18px]"
              >
                Mobile Phone Number
                <abbr
                  title="required"
                  className="no-underline text-[var(--secondary)]"
                >
                  *
                </abbr>
              </label>
            </div>

            <div className="flex w-full min-w-0 items-end border-b-2 border-[var(--secondary)] focus-within:border-[var(--secondary)]">
              <div className="relative shrink-0">
                <select
                  aria-label="Country calling code"
                  value={phoneDialCode}
                  onChange={(e) => setPhoneDialCode(e.target.value)}
                  className="h-[48px] min-w-[88px] cursor-pointer appearance-none bg-transparent py-2.5 pl-1 pr-8 text-[17px] text-para-color  outline-none md:text-[18px]"
                >
                  {PHONE_DIAL_OPTIONS.map((o) => (
                    <option key={o.dial} value={o.dial}>
                      {o.flag} {o.dial}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--secondary)]"
                  aria-hidden
                  strokeWidth={2.5}
                />
              </div>
              <input
                id="steps-mobile-local"
                name="phone-local-field"
                type="tel"
                autoComplete="tel-national"
                autoFocus
                inputMode="tel"
                value={phoneLocal}
                onChange={(e) => setPhoneLocal(e.target.value)}
                placeholder="(201) 555-0123"
                className="min-w-0 flex-1 border-0 bg-transparent py-2.5 text-[17px] text-[var(--secondary)] caret-[var(--secondary)] placeholder:text-[color-mix(in_srgb,var(--secondary)_38%,#0a2a5c)] focus:outline-none md:text-[18px]"
              />
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="order-2 text-[14px] font-semibold text-[var(--primary)] underline-offset-2 hover:underline sm:order-1"
                onClick={() => setStep(6)}
              >
                Back
              </button>
              <button
                type="button"
                disabled={!isValidPhoneLocal(phoneDialCode, phoneLocal)}
                className="order-1 self-start rounded-[10px] bg-[var(--secondary)] px-10 py-3 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(193,49,148,0.35)] transition-[opacity,transform] enabled:hover:scale-[1.02] enabled:hover:shadow-[0_8px_24px_rgba(193,49,148,0.45)] disabled:cursor-not-allowed disabled:opacity-45 sm:order-2"
                onClick={() => {
                  if (!isValidPhoneLocal(phoneDialCode, phoneLocal)) return;
                  setStep(8);
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="pt-2">
            <fieldset className="m-0 border-0 p-0">
              <legend className="mb-8 flex w-full items-start gap-3 px-0 text-left">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--secondary)] text-[15px] font-bold text-white"
                  aria-hidden
                >
                  6
                </span>
                <span
                  id="steps-form-step8-heading"
                  className="pt-0.5 text-[17px] font-semibold leading-snug text-para-color  md:text-[18px]"
                >
                  Where will this event take place?
                  <abbr
                    title="required"
                    className="no-underline text-[var(--secondary)]"
                  >
                    *
                  </abbr>
                </span>
              </legend>

              <div
                className="flex flex-col gap-3"
                role="radiogroup"
                aria-labelledby="steps-form-step8-heading"
                aria-required="true"
              >
                {EVENT_LOCATION_OPTIONS.map((opt) => {
                  const selected = eventLocation === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={[
                        "flex cursor-pointer items-stretch gap-3 rounded-[14px] border-2 bg-[color-mix(in_srgb,var(--secondary)_6%,#fff)] px-3 py-3 transition-[border-color,box-shadow] md:px-4 md:py-3.5",
                        selected
                          ? "border-[var(--secondary)] shadow-[0_0_0_1px_var(--secondary)]"
                          : "border-[color-mix(in_srgb,var(--secondary)_42%,transparent)]",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name="event-location"
                        value={opt.value}
                        checked={selected}
                        className="sr-only"
                        onChange={() => setEventLocation(opt.value)}
                      />
                      <span
                        className={[
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border-2 text-[15px] font-bold transition-colors",
                          selected
                            ? "border-[var(--secondary)] bg-[var(--secondary)] text-white"
                            : "border-[var(--secondary)] bg-white text-[var(--secondary)]",
                        ].join(" ")}
                        aria-hidden
                      >
                        {opt.letter}
                      </span>
                      <span className="flex min-w-0 flex-1 items-center text-left text-[15px] font-medium leading-snug text-para-color  md:text-[16px]">
                        {opt.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="order-2 text-[14px] font-semibold text-[var(--primary)] underline-offset-2 hover:underline sm:order-1"
                  onClick={() => {
                    setEventLocation(null);
                    setStep(7);
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!eventLocation}
                  className="order-1 min-w-[140px] rounded-[13px] bg-[var(--secondary)] px-10 py-3.5 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(193,49,148,0.35)] transition-[opacity,transform] enabled:hover:scale-[1.02] enabled:hover:shadow-[0_8px_24px_rgba(193,49,148,0.45)] disabled:cursor-not-allowed disabled:opacity-45 sm:order-2"
                  onClick={() => {
                    if (!eventLocation) return;
                    setStep(9);
                  }}
                >
                  OK
                </button>
              </div>
            </fieldset>
          </div>
        )}

        {step === 9 && (
          <div className="relative pt-2 text-left">
            <div className="mb-6 flex w-full items-start gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--secondary)] text-[15px] font-bold text-white"
                aria-hidden
              >
                7
              </span>
              <div className="min-w-0 flex-1">
                <h2
                  id="steps-form-step9-heading"
                  className="text-[17px] font-semibold leading-snug text-para-color  md:text-[18px]"
                >
                  Please select the town where this event will take place
                  <abbr
                    title="required"
                    className="no-underline text-[var(--secondary)]"
                  >
                    *
                  </abbr>
                </h2>
                <p className="mt-3 flex flex-wrap items-center gap-2 text-[13px] leading-relaxed text-[var(--para-color)] md:text-[14px]">
                  <span>
                    We are currently only servicing towns in the New Jersey
                    listed here.
                  </span>
                  <span
                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#22c55e] text-white"
                    aria-hidden
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                </p>
              </div>
            </div>

            <div ref={stateComboboxRef} className="relative w-full">
              <button
                type="button"
                aria-expanded={stateDropdownOpen}
                aria-haspopup="listbox"
                aria-controls="steps-state-listbox"
                className="flex w-full items-center justify-between gap-3 border-b border-[color-mix(in_srgb,var(--secondary)_55%,#e2e8f0)] py-3 text-left transition-colors hover:border-[var(--secondary)] focus:border-[var(--secondary)] focus:outline-none"
                onClick={() => {
                  setStateDropdownOpen((o) => !o);
                }}
              >
                <span
                  className={
                    eventState
                      ? "text-[17px] text-para-color  md:text-[18px]"
                      : "text-[17px] text-[color-mix(in_srgb,var(--secondary)_55%,#94a3b8)] md:text-[18px]"
                  }
                >
                  {eventState ?? "Type or select an option"}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[var(--secondary)] transition-transform ${stateDropdownOpen ? "rotate-180" : ""}`}
                  aria-hidden
                  strokeWidth={2.5}
                />
              </button>

              {stateDropdownOpen && (
                <div
                  id="steps-state-listbox"
                  role="listbox"
                  aria-label="US states"
                  className="absolute left-0 right-0 z-20 mt-3 max-h-[min(320px,50dvh)] overflow-hidden rounded-[14px] border border-[color-mix(in_srgb,var(--secondary)_22%,transparent)] bg-[color-mix(in_srgb,var(--secondary)_8%,#fff)] shadow-[0_16px_48px_rgba(10,42,92,0.12)]"
                >
                  <div className="flex items-center gap-2 border-b-2 border-[var(--secondary)] px-3 py-2.5">
                    <input
                      type="text"
                      value={stateSearch}
                      onChange={(e) => setStateSearch(e.target.value)}
                      placeholder="Search states…"
                      autoFocus
                      className="min-w-0 flex-1 border-0 bg-transparent py-1 text-[15px] text-para-color  placeholder:text-[color-mix(in_srgb,var(--secondary)_45%,#94a3b8)] focus:outline-none"
                      aria-autocomplete="list"
                    />
                    <Search
                      className="h-5 w-5 shrink-0 text-[var(--secondary)]"
                      aria-hidden
                      strokeWidth={2.25}
                    />
                  </div>
                  <ul className="max-h-[240px] overflow-y-auto p-2">
                    {US_STATES.filter((s) =>
                      s
                        .toLowerCase()
                        .includes(stateSearch.trim().toLowerCase())
                    ).map((name) => (
                      <li key={name} role="presentation">
                        <button
                          type="button"
                          role="option"
                          aria-selected={eventState === name}
                          className="w-full rounded-[10px] px-3 py-2.5 text-left text-[15px] font-medium text-[var(--secondary)] transition-colors hover:bg-[color-mix(in_srgb,var(--secondary)_12%,#fff)]"
                          onClick={() => {
                            setEventState(name);
                            setStateSearch("");
                            setStateDropdownOpen(false);
                          }}
                        >
                          {name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="order-2 text-[14px] font-semibold text-[var(--primary)] underline-offset-2 hover:underline sm:order-1"
                onClick={() => {
                  setEventState(null);
                  setStateDropdownOpen(false);
                  setStateSearch("");
                  setStep(8);
                }}
              >
                Back
              </button>
              <button
                type="button"
                disabled={!eventState}
                className="order-1 self-start rounded-[10px] bg-[var(--secondary)] px-10 py-3 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(193,49,148,0.35)] transition-[opacity,transform] enabled:hover:scale-[1.02] enabled:hover:shadow-[0_8px_24px_rgba(193,49,148,0.45)] disabled:cursor-not-allowed disabled:opacity-45 sm:order-2"
                onClick={() => {
                  if (!eventState) return;
                  setStep(10);
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {step === 10 && (
          <div className="pt-2 text-left">
            <div className="mb-8 flex w-full items-start gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--secondary)] text-[15px] font-bold text-white"
                aria-hidden
              >
                8
              </span>
              <h2
                id="steps-form-step10-heading"
                className="pt-0.5 text-[17px] font-semibold leading-snug text-para-color  md:text-[18px]"
              >
                Please give us the street address where the event will take
                place in{" "}
                <abbr
                  title="required"
                  className="no-underline text-[var(--secondary)]"
                >
                  *
                </abbr>
              </h2>
            </div>

            <div className="space-y-7">
              <div>
                <label
                  htmlFor="steps-addr-line1"
                  className="mb-1 block text-[14px] font-semibold text-para-color "
                >
                  Address
                  <abbr
                    title="required"
                    className="no-underline text-[var(--secondary)]"
                  >
                    *
                  </abbr>
                </label>
                <input
                  id="steps-addr-line1"
                  type="text"
                  autoComplete="street-address"
                  autoFocus
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="65 Hansen Way"
                  className="w-full border-0 border-b border-[color-mix(in_srgb,var(--secondary)_50%,#e2e8f0)] bg-transparent py-2.5 text-[16px] text-para-color  placeholder:text-[color-mix(in_srgb,var(--secondary)_48%,#94a3b8)] focus:border-[var(--secondary)] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="steps-addr-line2"
                  className="mb-1 block text-[14px] font-semibold text-para-color "
                >
                  Address line 2
                </label>
                <input
                  id="steps-addr-line2"
                  type="text"
                  autoComplete="address-line2"
                  value={streetAddress2}
                  onChange={(e) => setStreetAddress2(e.target.value)}
                  placeholder="Apartment 4"
                  className="w-full border-0 border-b border-[color-mix(in_srgb,var(--secondary)_50%,#e2e8f0)] bg-transparent py-2.5 text-[16px] text-para-color  placeholder:text-[color-mix(in_srgb,var(--secondary)_48%,#94a3b8)] focus:border-[var(--secondary)] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="steps-addr-city"
                  className="mb-1 block text-[14px] font-semibold text-para-color "
                >
                  City/Town
                  <abbr
                    title="required"
                    className="no-underline text-[var(--secondary)]"
                  >
                    *
                  </abbr>
                </label>
                <input
                  id="steps-addr-city"
                  type="text"
                  autoComplete="address-level2"
                  value={addressCity}
                  onChange={(e) => setAddressCity(e.target.value)}
                  placeholder="Palo Alto"
                  className="w-full border-0 border-b border-[color-mix(in_srgb,var(--secondary)_50%,#e2e8f0)] bg-transparent py-2.5 text-[16px] text-para-color  placeholder:text-[color-mix(in_srgb,var(--secondary)_48%,#94a3b8)] focus:border-[var(--secondary)] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="steps-addr-region"
                  className="mb-1 block text-[14px] font-semibold text-para-color "
                >
                  State/Region/Province
                  <abbr
                    title="required"
                    className="no-underline text-[var(--secondary)]"
                  >
                    *
                  </abbr>
                </label>
                <input
                  id="steps-addr-region"
                  type="text"
                  autoComplete="address-level1"
                  value={addressStateRegion}
                  onChange={(e) => setAddressStateRegion(e.target.value)}
                  placeholder="California"
                  className="w-full border-0 border-b border-[color-mix(in_srgb,var(--secondary)_50%,#e2e8f0)] bg-transparent py-2.5 text-[16px] text-para-color  placeholder:text-[color-mix(in_srgb,var(--secondary)_48%,#94a3b8)] focus:border-[var(--secondary)] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="steps-addr-zip"
                  className="mb-1 block text-[14px] font-semibold text-para-color "
                >
                  Zip/Post code
                  <abbr
                    title="required"
                    className="no-underline text-[var(--secondary)]"
                  >
                    *
                  </abbr>
                </label>
                <input
                  id="steps-addr-zip"
                  type="text"
                  autoComplete="postal-code"
                  value={addressZip}
                  onChange={(e) => setAddressZip(e.target.value)}
                  placeholder="94304"
                  className="w-full border-0 border-b border-[color-mix(in_srgb,var(--secondary)_50%,#e2e8f0)] bg-transparent py-2.5 text-[16px] text-para-color  placeholder:text-[color-mix(in_srgb,var(--secondary)_48%,#94a3b8)] focus:border-[var(--secondary)] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="steps-addr-country"
                  className="mb-1 block text-[14px] font-semibold text-para-color "
                >
                  Country
                </label>
                <input
                  id="steps-addr-country"
                  type="text"
                  autoComplete="country-name"
                  value={addressCountry}
                  onChange={(e) => setAddressCountry(e.target.value)}
                  placeholder="United States"
                  className="w-full border-0 border-b border-[color-mix(in_srgb,var(--secondary)_50%,#e2e8f0)] bg-transparent py-2.5 text-[16px] text-para-color  placeholder:text-[color-mix(in_srgb,var(--secondary)_48%,#94a3b8)] focus:border-[var(--secondary)] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="order-2 text-[14px] font-semibold text-[var(--primary)] underline-offset-2 hover:underline sm:order-1"
                onClick={() => setStep(9)}
              >
                Back
              </button>
              <button
                type="button"
                disabled={
                  !isAddressStepComplete(
                    streetAddress,
                    addressCity,
                    addressStateRegion,
                    addressZip
                  )
                }
                className="order-1 self-start rounded-[10px] bg-[var(--secondary)] px-10 py-3 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(193,49,148,0.35)] transition-[opacity,transform] enabled:hover:scale-[1.02] enabled:hover:shadow-[0_8px_24px_rgba(193,49,148,0.45)] disabled:cursor-not-allowed disabled:opacity-45 sm:order-2"
                onClick={() => {
                  if (
                    !isAddressStepComplete(
                      streetAddress,
                      addressCity,
                      addressStateRegion,
                      addressZip
                    )
                  )
                    return;
                  setStep(11);
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {step === 11 && (
          <div className="pt-2 text-center">
            <div className="mb-8 flex items-start justify-center gap-3 text-left">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--secondary)] text-[15px] font-bold text-white"
                aria-hidden
              >
                9
              </span>
              <h2
                id="steps-form-step11-heading"
                className="pt-0.5 text-[17px] font-semibold leading-snug text-[#4a5568] md:text-[18px]"
              >
                Please give us the date of your event
                <abbr
                  title="required"
                  className="no-underline text-[var(--secondary)]"
                >
                  *
                </abbr>
              </h2>
            </div>

            <div className="mx-auto flex max-w-[420px] flex-wrap items-end justify-center gap-2 sm:gap-3">
              <div className="w-[4.5rem] shrink-0 sm:w-24">
                <label
                  htmlFor="steps-event-mm"
                  className="mb-1 block text-center text-[11px] font-medium uppercase tracking-wide text-[color-mix(in_srgb,var(--secondary)_65%,#94a3b8)] sm:text-xs"
                >
                  Month
                </label>
                <input
                  id="steps-event-mm"
                  type="text"
                  inputMode="numeric"
                  autoComplete="bday-month"
                  autoFocus
                  maxLength={2}
                  value={eventDateMonth}
                  onChange={(e) =>
                    setEventDateMonth(e.target.value.replace(/\D/g, "").slice(0, 2))
                  }
                  placeholder="MM"
                  className="w-full border-0 border-b border-neutral-300 bg-transparent py-2 text-center text-[16px] text-para-color  placeholder:text-[color-mix(in_srgb,var(--secondary)_55%,#cbd5e1)] focus:border-[var(--secondary)] focus:outline-none"
                />
              </div>
              <span
                className="pb-2 text-lg font-light text-[color-mix(in_srgb,var(--secondary)_70%,#cbd5e1)]"
                aria-hidden
              >
                /
              </span>
              <div className="w-[4.5rem] shrink-0 sm:w-24">
                <label
                  htmlFor="steps-event-dd"
                  className="mb-1 block text-center text-[11px] font-medium uppercase tracking-wide text-[color-mix(in_srgb,var(--secondary)_65%,#94a3b8)] sm:text-xs"
                >
                  Day
                </label>
                <input
                  id="steps-event-dd"
                  type="text"
                  inputMode="numeric"
                  autoComplete="bday-day"
                  maxLength={2}
                  value={eventDateDay}
                  onChange={(e) =>
                    setEventDateDay(e.target.value.replace(/\D/g, "").slice(0, 2))
                  }
                  placeholder="DD"
                  className="w-full border-0 border-b border-neutral-300 bg-transparent py-2 text-center text-[16px] text-para-color  placeholder:text-[color-mix(in_srgb,var(--secondary)_55%,#cbd5e1)] focus:border-[var(--secondary)] focus:outline-none"
                />
              </div>
              <span
                className="pb-2 text-lg font-light text-[color-mix(in_srgb,var(--secondary)_70%,#cbd5e1)]"
                aria-hidden
              >
                /
              </span>
              <div className="w-[5.5rem] shrink-0 sm:w-28">
                <label
                  htmlFor="steps-event-yyyy"
                  className="mb-1 block text-center text-[11px] font-medium uppercase tracking-wide text-[color-mix(in_srgb,var(--secondary)_65%,#94a3b8)] sm:text-xs"
                >
                  Year
                </label>
                <input
                  id="steps-event-yyyy"
                  type="text"
                  inputMode="numeric"
                  autoComplete="bday-year"
                  maxLength={4}
                  value={eventDateYear}
                  onChange={(e) =>
                    setEventDateYear(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  placeholder="YYYY"
                  className="w-full border-0 border-b border-neutral-300 bg-transparent py-2 text-center text-[16px] text-para-color  placeholder:text-[color-mix(in_srgb,var(--secondary)_55%,#cbd5e1)] focus:border-[var(--secondary)] focus:outline-none"
                />
              </div>
            </div>

            <div className="mx-auto mt-10 flex w-full max-w-[420px] items-center justify-between gap-4">
              <button
                type="button"
                disabled={
                  !isValidEventDate(
                    eventDateMonth,
                    eventDateDay,
                    eventDateYear
                  )
                }
                className="rounded-[10px] bg-[var(--secondary)] px-10 py-3 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(193,49,148,0.35)] transition-[opacity,transform] enabled:hover:scale-[1.02] enabled:hover:shadow-[0_8px_24px_rgba(193,49,148,0.45)] disabled:cursor-not-allowed disabled:opacity-45"
                onClick={() => {
                  if (
                    !isValidEventDate(
                      eventDateMonth,
                      eventDateDay,
                      eventDateYear
                    )
                  )
                    return;
                  setStep(12);
                }}
              >
                OK
              </button>
              <button
                type="button"
                className="text-[14px] font-semibold text-[var(--primary)] underline-offset-2 hover:underline"
                onClick={() => setStep(10)}
              >
                Back
              </button>
            </div>
          </div>
        )}

        {step === 12 && (
          <div className="pt-2 text-left">
            <div className="mb-4 flex w-full items-start gap-3">
              <span
                className="flex h-9 min-w-9 shrink-0 items-center justify-center bg-[var(--secondary)] px-1.5 text-[14px] font-bold text-white sm:text-[15px]"
                aria-hidden
              >
                10
              </span>
              <div className="min-w-0 flex-1">
                <h2
                  id="steps-form-step12-heading"
                  className="text-[17px] font-semibold leading-snug text-[#4a5568] md:text-[18px]"
                >
                  Please give us the start time for the event
                  <abbr
                    title="required"
                    className="no-underline text-[var(--secondary)]"
                  >
                    *
                  </abbr>
                </h2>
                <p className="mt-2 text-[13px] italic leading-relaxed text-[var(--para-color)] md:text-[14px]">
                  What time will My Ice Cream Truck need to arrive?
                </p>
              </div>
            </div>

            <div ref={timeComboboxRef} className="relative w-full">
              <button
                type="button"
                aria-expanded={timeDropdownOpen}
                aria-haspopup="listbox"
                aria-controls="steps-time-listbox"
                className="flex w-full items-center justify-between gap-3 border-b border-[color-mix(in_srgb,var(--secondary)_55%,#e2e8f0)] py-3 text-left transition-colors hover:border-[var(--secondary)] focus:border-[var(--secondary)] focus:outline-none"
                onClick={() => setTimeDropdownOpen((o) => !o)}
              >
                <span
                  className={
                    eventStartTime
                      ? "text-[17px] text-para-color  md:text-[18px]"
                      : "text-[17px] text-[color-mix(in_srgb,var(--secondary)_55%,#94a3b8)] md:text-[18px]"
                  }
                >
                  {eventStartTime ?? "Type or select an option"}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[var(--secondary)] transition-transform ${timeDropdownOpen ? "rotate-180" : ""}`}
                  aria-hidden
                  strokeWidth={2.5}
                />
              </button>

              {timeDropdownOpen && (
                <div
                  id="steps-time-listbox"
                  role="listbox"
                  aria-label="Event start time"
                  className="absolute left-0 right-0 z-20 mt-3 max-h-[min(340px,52dvh)] overflow-hidden rounded-[14px] border border-[color-mix(in_srgb,var(--secondary)_22%,transparent)] bg-white shadow-[0_16px_48px_rgba(10,42,92,0.12)]"
                >
                  <div className="flex items-center gap-2 border-b-2 border-[var(--secondary)] px-3 py-2.5">
                    <input
                      type="text"
                      value={timeSearch}
                      onChange={(e) => setTimeSearch(e.target.value)}
                      placeholder="Search times…"
                      autoFocus
                      className="min-w-0 flex-1 border-0 bg-transparent py-1 text-[15px] text-para-color  placeholder:text-[color-mix(in_srgb,var(--secondary)_45%,#94a3b8)] focus:outline-none"
                      aria-autocomplete="list"
                    />
                    <Search
                      className="h-5 w-5 shrink-0 text-[var(--secondary)]"
                      aria-hidden
                      strokeWidth={2.25}
                    />
                  </div>
                  <ul className="max-h-[260px] overflow-y-auto bg-[color-mix(in_srgb,var(--secondary)_6%,#fff)] p-2">
                    {TIME_SLOTS.filter((t) =>
                      t
                        .toLowerCase()
                        .replace(/\s/g, "")
                        .includes(timeSearch.trim().toLowerCase().replace(/\s/g, ""))
                    ).map((slot) => (
                      <li key={slot} role="presentation">
                        <button
                          type="button"
                          role="option"
                          aria-selected={eventStartTime === slot}
                          className="w-full rounded-[10px] px-3 py-2.5 text-center text-[15px] font-medium text-[var(--secondary)] transition-colors hover:bg-[color-mix(in_srgb,var(--secondary)_14%,#fff)]"
                          onClick={() => {
                            setEventStartTime(slot);
                            setTimeSearch("");
                            setTimeDropdownOpen(false);
                          }}
                        >
                          {slot}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="order-2 text-[14px] font-semibold text-[var(--primary)] underline-offset-2 hover:underline sm:order-1"
                onClick={() => {
                  setEventStartTime(null);
                  setTimeDropdownOpen(false);
                  setTimeSearch("");
                  setStep(11);
                }}
              >
                Back
              </button>
              <button
                type="button"
                disabled={!eventStartTime}
                className="order-1 self-start rounded-[10px] bg-[var(--secondary)] px-10 py-3 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(193,49,148,0.35)] transition-[opacity,transform] enabled:hover:scale-[1.02] enabled:hover:shadow-[0_8px_24px_rgba(193,49,148,0.45)] disabled:cursor-not-allowed disabled:opacity-45 sm:order-2"
                onClick={() => {
                  if (!eventStartTime) return;
                  setStep(13);
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {step === 13 && (
          <div className="pt-2">
            <fieldset className="m-0 border-0 p-0">
              <legend className="mb-2 flex w-full items-start gap-3 px-0 text-left">
                <span
                  className="flex h-9 min-w-9 shrink-0 items-center justify-center bg-[var(--secondary)] px-1.5 text-[13px] font-bold text-white sm:text-[15px]"
                  aria-hidden
                >
                  11
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    id="steps-form-step13-heading"
                    className="block text-[17px] font-semibold leading-snug text-para-color  md:text-[18px]"
                  >
                    Will My Ice Cream Truck need to provide a COI for this
                    location?
                  </span>
                  <span className="mt-2 block text-[13px] leading-relaxed text-[var(--para-color)] md:text-[14px]">
                    COI = Certificate of Insurance
                  </span>
                </span>
              </legend>

              <div
                className="mt-8 flex flex-col gap-3"
                role="radiogroup"
                aria-labelledby="steps-form-step13-heading"
                aria-required="true"
              >
                {COI_OPTIONS.map((opt) => {
                  const selected = coiAnswer === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={[
                        "flex cursor-pointer items-stretch gap-3 rounded-[14px] border-2 bg-[color-mix(in_srgb,var(--secondary)_6%,#fff)] px-3 py-3 transition-[border-color,box-shadow] md:px-4 md:py-3.5",
                        selected
                          ? "border-[var(--secondary)] shadow-[0_0_0_1px_var(--secondary)]"
                          : "border-[color-mix(in_srgb,var(--secondary)_42%,transparent)]",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name="event-coi"
                        value={opt.value}
                        checked={selected}
                        className="sr-only"
                        onChange={() => setCoiAnswer(opt.value)}
                      />
                      <span
                        className={[
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border-2 text-[15px] font-bold transition-colors",
                          selected
                            ? "border-[var(--secondary)] bg-[var(--secondary)] text-white"
                            : "border-[var(--secondary)] bg-white text-[var(--secondary)]",
                        ].join(" ")}
                        aria-hidden
                      >
                        {opt.letter}
                      </span>
                      <span className="flex min-w-0 flex-1 items-center text-left text-[15px] font-medium leading-snug text-para-color  md:text-[16px]">
                        {opt.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="order-2 text-[14px] font-semibold text-[var(--primary)] underline-offset-2 hover:underline sm:order-1"
                  onClick={() => {
                    setCoiAnswer(null);
                    setStep(12);
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!coiAnswer}
                  className="order-1 min-w-[140px] rounded-[13px] bg-[var(--secondary)] px-10 py-3.5 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(193,49,148,0.35)] transition-[opacity,transform] enabled:hover:scale-[1.02] enabled:hover:shadow-[0_8px_24px_rgba(193,49,148,0.45)] disabled:cursor-not-allowed disabled:opacity-45 sm:order-2"
                  onClick={() => {
                    if (!coiAnswer) return;
                    setStep(14);
                  }}
                >
                  OK
                </button>
              </div>
            </fieldset>
          </div>
        )}

        {step === 14 && (
          <div className="pt-2 text-left">
            <div className="mb-6 flex w-full items-start gap-3">
              <span
                className="flex h-9 min-w-9 shrink-0 items-center justify-center bg-[var(--secondary)] px-1.5 text-[13px] font-bold text-white sm:text-[15px]"
                aria-hidden
              >
                12
              </span>
              <div className="min-w-0 flex-1">
                <h2
                  id="steps-form-step14-heading"
                  className="text-[17px] font-semibold leading-snug text-para-color  md:text-[18px]"
                >
                  Can you tell us a little bit about the event?
                </h2>
                <p className="mt-2 text-[13px] italic leading-relaxed text-[var(--para-color)] md:text-[14px]">
                  Is it a birthday party? A work event? Will there be a petting
                  zoo?? 🐹
                </p>
              </div>
            </div>

            <label htmlFor="steps-event-description" className="sr-only">
              About your event
            </label>
            <textarea
              id="steps-event-description"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (eventDescription.trim()) setStep(15);
                }
              }}
              rows={5}
              placeholder="Type your answer here..."
              className="w-full resize-y border-0 border-b-2 border-[color-mix(in_srgb,var(--secondary)_55%,#e2e8f0)] bg-transparent py-2.5 text-[16px] leading-relaxed text-para-color  placeholder:text-[color-mix(in_srgb,var(--secondary)_50%,#94a3b8)] focus:border-[var(--secondary)] focus:outline-none"
            />
            <p className="mt-2 text-[12px] font-medium text-[var(--secondary)] md:text-[13px]">
              Shift + Enter to make a line break
            </p>

            <div className="mt-10 flex items-center justify-between gap-4">
              <button
                type="button"
                disabled={!eventDescription.trim()}
                className="rounded-[10px] bg-[var(--secondary)] px-10 py-3 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(193,49,148,0.35)] transition-[opacity,transform] enabled:hover:scale-[1.02] enabled:hover:shadow-[0_8px_24px_rgba(193,49,148,0.45)] disabled:cursor-not-allowed disabled:opacity-45"
                onClick={() => {
                  if (!eventDescription.trim()) return;
                  setStep(15);
                }}
              >
                OK
              </button>
              <button
                type="button"
                className="text-[14px] font-semibold text-[var(--primary)] underline-offset-2 hover:underline"
                onClick={() => setStep(13)}
              >
                Back
              </button>
            </div>
          </div>
        )}

        {step === 15 && (
          <div className="pt-2">
            <fieldset className="m-0 border-0 p-0">
              <legend className="mb-2 flex w-full items-start gap-3 px-0 text-left">
                <span
                  className="flex h-9 min-w-9 shrink-0 items-center justify-center bg-[var(--secondary)] px-1.5 text-[13px] font-bold text-white sm:text-[15px]"
                  aria-hidden
                >
                  13
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    id="steps-form-step15-heading"
                    className="block text-[17px] font-semibold leading-snug text-para-color  md:text-[18px]"
                  >
                    Will there be other food service or food trucks at this
                    event?
                    <abbr
                      title="required"
                      className="no-underline text-[var(--secondary)]"
                    >
                      *
                    </abbr>
                  </span>
                </span>
              </legend>

              <div
                className="mt-8 flex flex-col gap-3"
                role="radiogroup"
                aria-labelledby="steps-form-step15-heading"
                aria-required="true"
              >
                {OTHER_FOOD_SERVICE_OPTIONS.map((opt) => {
                  const selected = otherFoodService === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={[
                        "flex cursor-pointer items-stretch gap-3 rounded-[14px] border-2 bg-[color-mix(in_srgb,var(--secondary)_6%,#fff)] px-3 py-3 transition-[border-color,box-shadow] md:px-4 md:py-3.5",
                        selected
                          ? "border-[var(--secondary)] shadow-[0_0_0_1px_var(--secondary)]"
                          : "border-[color-mix(in_srgb,var(--secondary)_42%,transparent)]",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name="other-food-service"
                        value={opt.value}
                        checked={selected}
                        className="sr-only"
                        onChange={() => setOtherFoodService(opt.value)}
                      />
                      <span
                        className={[
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border-2 text-[15px] font-bold transition-colors",
                          selected
                            ? "border-[var(--secondary)] bg-[var(--secondary)] text-white"
                            : "border-[var(--secondary)] bg-white text-[var(--secondary)]",
                        ].join(" ")}
                        aria-hidden
                      >
                        {opt.letter}
                      </span>
                      <span className="flex min-w-0 flex-1 items-center text-left text-[15px] font-medium leading-snug text-para-color  md:text-[16px]">
                        {opt.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="order-2 text-[14px] font-semibold text-[var(--primary)] underline-offset-2 hover:underline sm:order-1"
                  onClick={() => {
                    setOtherFoodService(null);
                    setStep(14);
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!otherFoodService}
                  className="order-1 min-w-[140px] rounded-[13px] bg-[var(--secondary)] px-10 py-3.5 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(193,49,148,0.35)] transition-[opacity,transform] enabled:hover:scale-[1.02] enabled:hover:shadow-[0_8px_24px_rgba(193,49,148,0.45)] disabled:cursor-not-allowed disabled:opacity-45 sm:order-2"
                  onClick={() => {
                    if (!otherFoodService) return;
                    setStep(16);
                  }}
                >
                  OK
                </button>
              </div>
            </fieldset>
          </div>
        )}

        {step === 16 && (
          <div className="pt-2">
            <fieldset className="m-0 border-0 p-0">
              <legend className="mb-2 flex w-full items-start gap-3 px-0 text-left">
                <span
                  className="flex h-9 min-w-9 shrink-0 items-center justify-center bg-[var(--secondary)] px-1.5 text-[13px] font-bold text-white sm:text-[15px]"
                  aria-hidden
                >
                  14
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    id="steps-form-step16-heading"
                    className="block text-[17px] font-semibold leading-snug text-para-color  md:text-[18px]"
                  >
                    Will My Ice Cream Truck be the only sweets/dessert option?
                    <abbr
                      title="required"
                      className="no-underline text-[var(--secondary)]"
                    >
                      *
                    </abbr>
                  </span>
                </span>
              </legend>

              <div
                className="mt-8 flex flex-col gap-3"
                role="radiogroup"
                aria-labelledby="steps-form-step16-heading"
                aria-required="true"
              >
                {ONLY_SWEETS_DESSERT_OPTIONS.map((opt) => {
                  const selected = onlySweetsDessertOption === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={[
                        "flex cursor-pointer items-stretch gap-3 rounded-[14px] border-2 bg-[color-mix(in_srgb,var(--secondary)_6%,#fff)] px-3 py-3 transition-[border-color,box-shadow] md:px-4 md:py-3.5",
                        selected
                          ? "border-[var(--secondary)] shadow-[0_0_0_1px_var(--secondary)]"
                          : "border-[color-mix(in_srgb,var(--secondary)_42%,transparent)]",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name="only-sweets-dessert"
                        value={opt.value}
                        checked={selected}
                        className="sr-only"
                        onChange={() => setOnlySweetsDessertOption(opt.value)}
                      />
                      <span
                        className={[
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border-2 text-[15px] font-bold transition-colors",
                          selected
                            ? "border-[var(--secondary)] bg-[var(--secondary)] text-white"
                            : "border-[var(--secondary)] bg-white text-[var(--secondary)]",
                        ].join(" ")}
                        aria-hidden
                      >
                        {opt.letter}
                      </span>
                      <span className="flex min-w-0 flex-1 items-center text-left text-[15px] font-medium leading-snug text-para-color  md:text-[16px]">
                        {opt.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="order-2 text-[14px] font-semibold text-[var(--primary)] underline-offset-2 hover:underline sm:order-1"
                  onClick={() => {
                    setOnlySweetsDessertOption(null);
                    setStep(15);
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!onlySweetsDessertOption}
                  className="order-1 min-w-[140px] rounded-[13px] bg-[var(--secondary)] px-10 py-3.5 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(193,49,148,0.35)] transition-[opacity,transform] enabled:hover:scale-[1.02] enabled:hover:shadow-[0_8px_24px_rgba(193,49,148,0.45)] disabled:cursor-not-allowed disabled:opacity-45 sm:order-2"
                  onClick={() => {
                    if (!onlySweetsDessertOption) return;
                    setStep(17);
                  }}
                >
                  OK
                </button>
              </div>
            </fieldset>
          </div>
        )}

        {step === 17 && (
          <div className="pt-2 text-left">
            <div className="mb-6 flex w-full items-start gap-3">
              <span
                className="flex h-9 min-w-9 shrink-0 items-center justify-center bg-[var(--secondary)] px-1.5 text-[13px] font-bold text-white sm:text-[15px]"
                aria-hidden
              >
                15
              </span>
              <div className="min-w-0 flex-1">
                <label
                  id="steps-form-step17-heading"
                  htmlFor="steps-approx-guests"
                  className="block cursor-pointer text-[17px] font-semibold leading-snug text-para-color  md:text-[18px]"
                >
                  Approximately how many guests will we be serving?
                  <abbr
                    title="required"
                    className="no-underline text-[var(--secondary)]"
                  >
                    *
                  </abbr>
                </label>
                <p className="mt-2 text-[13px] italic leading-relaxed text-[var(--para-color)] md:text-[14px]">
                  This will allow us to give you pricing.
                </p>
              </div>
            </div>
            <input
              id="steps-approx-guests"
              name="approx-guests-field"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              autoFocus
              value={approximateGuestCount}
              onChange={(e) => setApproximateGuestCount(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full border-0 border-b-2 border-[var(--secondary)] bg-transparent py-2.5 text-[17px] text-[var(--secondary)] caret-[var(--secondary)] placeholder:text-[color-mix(in_srgb,var(--secondary)_45%,#94a3b8)] focus:border-[var(--secondary)] focus:outline-none md:text-[18px]"
            />
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="order-2 text-[14px] font-semibold text-[var(--primary)] underline-offset-2 hover:underline sm:order-1"
                onClick={() => setStep(16)}
              >
                Back
              </button>
              <button
                type="button"
                disabled={!approximateGuestCount.trim()}
                className="order-1 self-start rounded-[10px] bg-[var(--secondary)] px-10 py-3 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(193,49,148,0.35)] transition-[opacity,transform] enabled:hover:scale-[1.02] enabled:hover:shadow-[0_8px_24px_rgba(193,49,148,0.45)] disabled:cursor-not-allowed disabled:opacity-45 sm:order-2"
                onClick={() => {
                  if (!approximateGuestCount.trim()) return;
                  setStep(18);
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {step === 18 && (
          <div className="pt-2">
            <fieldset className="m-0 border-0 p-0">
              <legend className="mb-2 flex w-full items-start gap-3 px-0 text-left">
                <span
                  className="flex h-9 min-w-9 shrink-0 items-center justify-center bg-[var(--secondary)] px-1.5 text-[13px] font-bold text-white sm:text-[15px]"
                  aria-hidden
                >
                  16
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    id="steps-form-step18-heading"
                    className="block text-[17px] font-semibold leading-snug text-para-color  md:text-[18px]"
                  >
                    Which menu option would you be interested in?
                    <abbr
                      title="required"
                      className="no-underline text-[var(--secondary)]"
                    >
                      *
                    </abbr>
                  </span>
                  <span className="mt-3 block text-[13px] leading-relaxed text-[var(--para-color)] md:text-[14px]">
                    <strong className="font-semibold text-para-color ">
                      Full Menu:
                    </strong>{" "}
                    Includes all items (cups, cones, sundaes, shakes, etc.). We
                    can serve approximately 50 guests per hour.
                  </span>
                  <span className="mt-2 block text-[13px] leading-relaxed text-[var(--para-color)] md:text-[14px]">
                    <strong className="font-semibold text-para-color ">
                      Limited Menu:
                    </strong>{" "}
                    Includes one regular size cup/cone with one topping and one
                    drizzle. We can serve approximately 80 guests per hour.
                  </span>
                </span>
              </legend>

              <div
                className="mt-8 flex flex-col gap-3"
                role="radiogroup"
                aria-labelledby="steps-form-step18-heading"
                aria-required="true"
              >
                {MENU_INTEREST_OPTIONS.map((opt) => {
                  const selected = menuInterestOption === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={[
                        "flex cursor-pointer items-stretch gap-3 rounded-[14px] border-2 bg-[color-mix(in_srgb,var(--secondary)_6%,#fff)] px-3 py-3 transition-[border-color,box-shadow] md:px-4 md:py-3.5",
                        selected
                          ? "border-[var(--secondary)] shadow-[0_0_0_1px_var(--secondary)]"
                          : "border-[color-mix(in_srgb,var(--secondary)_42%,transparent)]",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name="menu-interest"
                        value={opt.value}
                        checked={selected}
                        className="sr-only"
                        onChange={() => setMenuInterestOption(opt.value)}
                      />
                      <span
                        className={[
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border-2 text-[15px] font-bold transition-colors",
                          selected
                            ? "border-[var(--secondary)] bg-[var(--secondary)] text-white"
                            : "border-[var(--secondary)] bg-white text-[var(--secondary)]",
                        ].join(" ")}
                        aria-hidden
                      >
                        {opt.letter}
                      </span>
                      <span className="flex min-w-0 flex-1 items-center text-left text-[15px] font-medium leading-snug text-para-color  md:text-[16px]">
                        {opt.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="order-2 text-[14px] font-semibold text-[var(--primary)] underline-offset-2 hover:underline sm:order-1"
                  onClick={() => {
                    setMenuInterestOption(null);
                    setStep(17);
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!menuInterestOption}
                  className="order-1 min-w-[140px] rounded-[13px] bg-[var(--secondary)] px-10 py-3.5 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(193,49,148,0.35)] transition-[opacity,transform] enabled:hover:scale-[1.02] enabled:hover:shadow-[0_8px_24px_rgba(193,49,148,0.45)] disabled:cursor-not-allowed disabled:opacity-45 sm:order-2"
                  onClick={() => {
                    if (!menuInterestOption) return;
                    setStep(19);
                  }}
                >
                  OK
                </button>
              </div>
            </fieldset>
          </div>
        )}

        {step === 19 && (
          <div className="pt-2">
            <fieldset className="m-0 border-0 p-0">
              <legend className="mb-2 flex w-full items-start gap-3 px-0 text-left">
                <span
                  className="flex h-9 min-w-9 shrink-0 items-center justify-center bg-[var(--secondary)] px-1.5 text-[13px] font-bold text-white sm:text-[15px]"
                  aria-hidden
                >
                  17
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    id="steps-form-step19-heading"
                    className="block text-[17px] font-semibold leading-snug text-para-color  md:text-[18px]"
                  >
                    Do we need to serve your guests within a specific window of
                    time?
                    <abbr
                      title="required"
                      className="no-underline text-[var(--secondary)]"
                    >
                      *
                    </abbr>
                  </span>
                  <span className="mt-2 block text-[13px] leading-relaxed text-[var(--para-color)] md:text-[14px]">
                    Example: All guests need to be served within 2 hours.
                  </span>
                </span>
              </legend>

              <div
                className="mt-8 flex flex-col gap-3"
                role="radiogroup"
                aria-labelledby="steps-form-step19-heading"
                aria-required="true"
              >
                {SERVE_TIME_WINDOW_OPTIONS.map((opt) => {
                  const selected = serveTimeWindowAnswer === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={[
                        "flex cursor-pointer items-stretch gap-3 rounded-[14px] border-2 bg-[color-mix(in_srgb,var(--secondary)_6%,#fff)] px-3 py-3 transition-[border-color,box-shadow] md:px-4 md:py-3.5",
                        selected
                          ? "border-[var(--secondary)] shadow-[0_0_0_1px_var(--secondary)]"
                          : "border-[color-mix(in_srgb,var(--secondary)_42%,transparent)]",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name="serve-time-window"
                        value={opt.value}
                        checked={selected}
                        className="sr-only"
                        onChange={() => setServeTimeWindowAnswer(opt.value)}
                      />
                      <span
                        className={[
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border-2 text-[15px] font-bold transition-colors",
                          selected
                            ? "border-[var(--secondary)] bg-[var(--secondary)] text-white"
                            : "border-[var(--secondary)] bg-white text-[var(--secondary)]",
                        ].join(" ")}
                        aria-hidden
                      >
                        {opt.letter}
                      </span>
                      <span className="flex min-w-0 flex-1 items-center text-left text-[15px] font-medium leading-snug text-para-color  md:text-[16px]">
                        {opt.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="order-2 text-[14px] font-semibold text-[var(--primary)] underline-offset-2 hover:underline sm:order-1"
                  onClick={() => {
                    setServeTimeWindowAnswer(null);
                    setStep(18);
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!serveTimeWindowAnswer}
                  className="order-1 min-w-[140px] rounded-[13px] bg-[var(--secondary)] px-10 py-3.5 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(193,49,148,0.35)] transition-[opacity,transform] enabled:hover:scale-[1.02] enabled:hover:shadow-[0_8px_24px_rgba(193,49,148,0.45)] disabled:cursor-not-allowed disabled:opacity-45 sm:order-2"
                  onClick={() => {
                    if (!serveTimeWindowAnswer) return;
                    setStep(20);
                  }}
                >
                  OK
                </button>
              </div>
            </fieldset>
          </div>
        )}

        {step === 20 && (
          <div className="pt-2">
            <fieldset className="m-0 border-0 p-0">
              <legend className="mb-2 flex w-full items-start gap-3 px-0 text-left">
                <span
                  className="flex h-9 min-w-9 shrink-0 items-center justify-center bg-[var(--secondary)] px-1.5 text-[13px] font-bold text-white sm:text-[15px]"
                  aria-hidden
                >
                  18
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    id="steps-form-step20-heading"
                    className="block text-[17px] font-semibold leading-snug text-para-color  md:text-[18px]"
                  >
                    Got it! Please select the number of hours below:
                    <abbr
                      title="required"
                      className="no-underline text-[var(--secondary)]"
                    >
                      *
                    </abbr>
                  </span>
                  <span className="mt-2 block text-[13px] leading-relaxed text-[var(--para-color)] md:text-[14px]">
                    Minimum 1 hour.
                  </span>
                </span>
              </legend>

              <div
                className="mt-8 flex flex-col gap-3"
                role="radiogroup"
                aria-labelledby="steps-form-step20-heading"
                aria-required="true"
              >
                {SERVICE_HOURS_OPTIONS.map((opt) => {
                  const selected = serviceHoursOption === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={[
                        "flex cursor-pointer items-stretch gap-3 rounded-[14px] border-2 bg-[color-mix(in_srgb,var(--secondary)_6%,#fff)] px-3 py-3 transition-[border-color,box-shadow] md:px-4 md:py-3.5",
                        selected
                          ? "border-[var(--secondary)] shadow-[0_0_0_1px_var(--secondary)]"
                          : "border-[color-mix(in_srgb,var(--secondary)_42%,transparent)]",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name="service-hours"
                        value={opt.value}
                        checked={selected}
                        className="sr-only"
                        onChange={() => setServiceHoursOption(opt.value)}
                      />
                      <span
                        className={[
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border-2 text-[15px] font-bold transition-colors",
                          selected
                            ? "border-[var(--secondary)] bg-[var(--secondary)] text-white"
                            : "border-[var(--secondary)] bg-white text-[var(--secondary)]",
                        ].join(" ")}
                        aria-hidden
                      >
                        {opt.letter}
                      </span>
                      <span className="flex min-w-0 flex-1 items-center text-left text-[15px] font-medium leading-snug text-para-color  md:text-[16px]">
                        {opt.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="order-2 text-[14px] font-semibold text-[var(--primary)] underline-offset-2 hover:underline sm:order-1"
                  onClick={() => {
                    setServiceHoursOption(null);
                    setStep(19);
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!serviceHoursOption}
                  className="order-1 min-w-[140px] rounded-[13px] bg-[var(--secondary)] px-10 py-3.5 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(193,49,148,0.35)] transition-[opacity,transform] enabled:hover:scale-[1.02] enabled:hover:shadow-[0_8px_24px_rgba(193,49,148,0.45)] disabled:cursor-not-allowed disabled:opacity-45 sm:order-2"
                  onClick={() => {
                    if (!serviceHoursOption) return;
                    setStep(21);
                  }}
                >
                  OK
                </button>
              </div>
            </fieldset>
          </div>
        )}

        {step === 21 && (
          <div className="pt-2">
            <fieldset className="m-0 border-0 p-0">
              <legend className="mb-2 flex w-full items-start gap-3 px-0 text-left">
                <span
                  className="flex h-9 min-w-9 shrink-0 items-center justify-center bg-[var(--secondary)] px-1.5 text-[13px] font-bold text-white sm:text-[15px]"
                  aria-hidden
                >
                  19
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    id="steps-form-step21-heading"
                    className="block text-[17px] font-semibold leading-snug text-para-color  md:text-[18px]"
                  >
                    Who will be paying for this event?
                    <abbr
                      title="required"
                      className="no-underline text-[var(--secondary)]"
                    >
                      *
                    </abbr>
                  </span>
                </span>
              </legend>

              <div
                className="mt-8 flex flex-col gap-3"
                role="radiogroup"
                aria-labelledby="steps-form-step21-heading"
                aria-required="true"
              >
                {EVENT_PAYER_OPTIONS.map((opt) => {
                  const selected = eventPayerOption === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={[
                        "flex cursor-pointer items-stretch gap-3 rounded-[14px] border-2 bg-[color-mix(in_srgb,var(--secondary)_6%,#fff)] px-3 py-3 transition-[border-color,box-shadow] md:px-4 md:py-3.5",
                        selected
                          ? "border-[var(--secondary)] shadow-[0_0_0_1px_var(--secondary)]"
                          : "border-[color-mix(in_srgb,var(--secondary)_42%,transparent)]",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name="who-pays-for-event"
                        value={opt.value}
                        checked={selected}
                        className="sr-only"
                        onChange={() => setEventPayerOption(opt.value)}
                      />
                      <span
                        className={[
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border-2 text-[15px] font-bold transition-colors",
                          selected
                            ? "border-[var(--secondary)] bg-[var(--secondary)] text-white"
                            : "border-[var(--secondary)] bg-white text-[var(--secondary)]",
                        ].join(" ")}
                        aria-hidden
                      >
                        {opt.letter}
                      </span>
                      <span className="flex min-w-0 flex-1 items-center text-left text-[15px] font-medium leading-snug text-para-color  md:text-[16px]">
                        {opt.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="order-2 text-[14px] font-semibold text-[var(--primary)] underline-offset-2 hover:underline sm:order-1"
                  onClick={() => {
                    setEventPayerOption(null);
                    setStep(20);
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!eventPayerOption}
                  className="order-1 min-w-[140px] rounded-[13px] bg-[var(--secondary)] px-10 py-3.5 text-[15px] font-bold uppercase tracking-wide text-white shadow-[0_6px_20px_rgba(193,49,148,0.35)] transition-[opacity,transform] enabled:hover:scale-[1.02] enabled:hover:shadow-[0_8px_24px_rgba(193,49,148,0.45)] disabled:cursor-not-allowed disabled:opacity-45 sm:order-2"
                  onClick={() => {
                    if (!eventPayerOption) return;
                    setStep(22);
                  }}
                >
                  OK
                </button>
              </div>
            </fieldset>
          </div>
        )}

        {step === 22 && (
          <div className="pt-2">
            <form
              ref={inquiryFormRef}
              className="space-y-5"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!bookingInterestAnswer) return;
                setSubmitError("");
                const eventDateIso =
                  isValidEventDate(eventDateMonth, eventDateDay, eventDateYear)
                    ? `${eventDateYear}-${eventDateMonth.padStart(2, "0")}-${eventDateDay.padStart(2, "0")}`
                    : "";
                if (!eventDateIso) {
                  setSubmitError("Please complete a valid event date.");
                  return;
                }
                const eventTime24 = amPmTo24Hour(eventStartTime);
                if (!eventTime24) {
                  setSubmitError("Please select a valid event start time.");
                  return;
                }
                if (
                  !isAddressStepComplete(
                    streetAddress,
                    addressCity,
                    addressStateRegion,
                    addressZip
                  )
                ) {
                  setSubmitError("Address is incomplete.");
                  return;
                }
                setSubmitting(true);
                try {
                  const packages = await fetchActivePackages();
                  const packageId = pickPackageIdForMenuInterest(
                    packages,
                    menuInterestOption
                  );
                  const customerName =
                    `${firstName.trim()} ${lastName.trim()}`.trim();
                  const eventAddress = [
                    streetAddress.trim(),
                    streetAddress2.trim(),
                    addressCity.trim(),
                    addressStateRegion.trim(),
                    addressZip.trim(),
                    addressCountry.trim(),
                  ]
                    .filter(Boolean)
                    .join(", ");
                  const phoneFull =
                    `${phoneDialCode} ${phoneLocal.trim()}`.trim();
                  const stepFormData: StepFormSnapshot = {
                    eventType,
                    firstName,
                    lastName,
                    inquiryEmail: inquiryEmail.trim(),
                    phoneDialCode,
                    phoneLocal,
                    eventLocation,
                    eventState,
                    streetAddress,
                    streetAddress2,
                    addressCity,
                    addressStateRegion,
                    addressZip,
                    addressCountry,
                    eventDateMonth,
                    eventDateDay,
                    eventDateYear,
                    eventDateIso,
                    eventStartTime,
                    otherFoodService,
                    onlySweetsDessertOption,
                    coiAnswer,
                    eventDescription,
                    approximateGuestCount,
                    menuInterestOption,
                    serveTimeWindowAnswer,
                    serviceHoursOption,
                    eventPayerOption,
                    bookingInterestAnswer,
                    quotedEventBasePrice,
                  };
                  const specialParts = [
                    "Source: website step form",
                    `Interested in booking: ${bookingInterestAnswer === "yes" ? "Yes" : "No"}`,
                    approximateGuestCount.trim() &&
                      `Approx. guests: ${approximateGuestCount.trim()}`,
                    menuInterestOption &&
                      `Menu interest (code): ${menuInterestOption}`,
                    serviceHoursOption &&
                      `Service hours (code): ${serviceHoursOption}`,
                    eventPayerOption && `Payer (code): ${eventPayerOption}`,
                    eventType && `Event type (code): ${eventType}`,
                    eventLocation && `Venue type (code): ${eventLocation}`,
                    eventState && `Event state: ${eventState}`,
                    otherFoodService &&
                      `Other food service at event (code): ${otherFoodService}`,
                    onlySweetsDessertOption &&
                      `Only sweets/dessert (code): ${onlySweetsDessertOption}`,
                    coiAnswer && `COI (code): ${coiAnswer}`,
                    serveTimeWindowAnswer &&
                      `Serve time window (code): ${serveTimeWindowAnswer}`,
                    eventDescription.trim() &&
                      `\nEvent description:\n${eventDescription.trim()}`,
                  ].filter(Boolean) as string[];
                  const special_notes = specialParts.join("\n").slice(0, 7900);
                  await submitPublicBooking({
                    event_date: eventDateIso,
                    event_time: eventTime24,
                    duration_minutes: serviceHoursToMinutes(serviceHoursOption),
                    package_id: packageId,
                    add_ons: [],
                    customer_name: customerName,
                    customer_phone: phoneFull,
                    customer_email: inquiryEmail.trim(),
                    event_address: eventAddress,
                    special_notes: special_notes || null,
                    step_form_data: stepFormData,
                  });
                  setSubmitting(false);
                  await Swal.fire({
                    icon: "success",
                    title: "Thank you!",
                    text: "Your booking request has been submitted successfully. We'll be in touch soon.",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#c13194",
                    buttonsStyling: true,
                    allowOutsideClick: true,
                    allowEscapeKey: true,
                  });
                  onClose();
                } catch (err) {
                  setSubmitError(
                    err instanceof Error ? err.message : "Submit failed."
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <input type="hidden" name="event-type" value={eventType ?? ""} />
              <input type="hidden" name="event-location" value={eventLocation ?? ""} />
              <input type="hidden" name="event-state" value={eventState ?? ""} />
              <input type="hidden" name="street-address" value={streetAddress} />
              <input type="hidden" name="street-address-2" value={streetAddress2} />
              <input type="hidden" name="address-city" value={addressCity} />
              <input type="hidden" name="address-region" value={addressStateRegion} />
              <input type="hidden" name="address-zip" value={addressZip} />
              <input type="hidden" name="address-country" value={addressCountry.trim() || "United States"} />
              <input type="hidden" name="event-date-month" value={eventDateMonth} />
              <input type="hidden" name="event-date-day" value={eventDateDay} />
              <input type="hidden" name="event-date-year" value={eventDateYear} />
              <input
                type="hidden"
                name="event-date"
                value={
                  isValidEventDate(eventDateMonth, eventDateDay, eventDateYear)
                    ? `${eventDateYear}-${eventDateMonth.padStart(2, "0")}-${eventDateDay.padStart(2, "0")}`
                    : ""
                }
              />
              <input type="hidden" name="event-start-time" value={eventStartTime ?? ""} />
              <input
                type="hidden"
                name="other-food-service"
                value={otherFoodService ?? ""}
              />
              <input
                type="hidden"
                name="only-sweets-dessert"
                value={onlySweetsDessertOption ?? ""}
              />
              <input
                type="hidden"
                name="menu-interest"
                value={menuInterestOption ?? ""}
              />
              <input
                type="hidden"
                name="serve-time-window"
                value={serveTimeWindowAnswer ?? ""}
              />
              <input
                type="hidden"
                name="service-hours"
                value={serviceHoursOption ?? ""}
              />
              <input
                type="hidden"
                name="who-pays-for-event"
                value={eventPayerOption ?? ""}
              />
              <input type="hidden" name="event-coi" value={coiAnswer ?? ""} />
              <input type="hidden" name="first-name" value={firstName} />
              <input type="hidden" name="last-name" value={lastName} />
              <input
                type="hidden"
                name="name"
                value={`${firstName.trim()} ${lastName.trim()}`.trim()}
              />
              <input type="hidden" name="email" value={inquiryEmail.trim()} />
              <input
                type="hidden"
                name="phone"
                value={`${phoneDialCode} ${phoneLocal.trim()}`.trim()}
              />
              <input
                type="hidden"
                name="event-quote-base"
                value={quotedEventBasePrice}
              />
              <input type="hidden" name="guests" value={approximateGuestCount} />
              <input type="hidden" name="message" value={eventDescription} />
              <fieldset className="m-0 border-0 p-0">
                <legend className="mb-2 flex w-full items-start gap-3 px-0 text-left">
                  <span
                    className="flex h-9 min-w-9 shrink-0 items-center justify-center bg-[var(--secondary)] px-1.5 text-[13px] font-bold text-white sm:text-[15px]"
                    aria-hidden
                  >
                    20
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      id="steps-form-step22-heading"
                      className="block text-[17px] font-semibold leading-snug text-para-color  md:text-[18px]"
                    >
                      OK! The cost for this event will be{" "}
                      <span className="whitespace-nowrap">
                        {quotedEventBasePrice}
                      </span>{" "}
                      plus NJ sales tax and 20% gratuity. Are you interested in
                      booking it?
                      <abbr
                        title="required"
                        className="no-underline text-[var(--secondary)]"
                      >
                        *
                      </abbr>
                    </span>
                  </span>
                </legend>

                <div
                  className="mt-8 flex flex-col gap-3"
                  role="radiogroup"
                  aria-labelledby="steps-form-step22-heading"
                  aria-required="true"
                >
                  {BOOKING_INTEREST_OPTIONS.map((opt) => {
                    const selected = bookingInterestAnswer === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={[
                          "flex cursor-pointer items-stretch gap-3 rounded-[14px] border-2 bg-[color-mix(in_srgb,var(--secondary)_6%,#fff)] px-3 py-3 transition-[border-color,box-shadow] md:px-4 md:py-3.5",
                          selected
                            ? "border-[var(--secondary)] shadow-[0_0_0_1px_var(--secondary)]"
                            : "border-[color-mix(in_srgb,var(--secondary)_42%,transparent)]",
                        ].join(" ")}
                      >
                        <input
                          type="radio"
                          name="interested-in-booking"
                          value={opt.value}
                          checked={selected}
                          className="sr-only"
                          onChange={() => setBookingInterestAnswer(opt.value)}
                        />
                        <span
                          className={[
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border-2 text-[15px] font-bold transition-colors",
                            selected
                              ? "border-[var(--secondary)] bg-[var(--secondary)] text-white"
                              : "border-[var(--secondary)] bg-white text-[var(--secondary)]",
                          ].join(" ")}
                          aria-hidden
                        >
                          {opt.letter}
                        </span>
                        <span className="flex min-w-0 flex-1 items-center text-left text-[15px] font-medium leading-snug text-para-color  md:text-[16px]">
                          {opt.label}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {submitError ? (
                  <p className="mt-4 text-sm font-medium text-red-600" role="alert">
                    {submitError}
                  </p>
                ) : null}

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    disabled={submitting}
                    className="order-2 text-[14px] font-semibold text-[var(--primary)] underline-offset-2 hover:underline disabled:opacity-40 sm:order-1"
                    onClick={() => {
                      setBookingInterestAnswer(null);
                      setStep(21);
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!bookingInterestAnswer || submitting}
                    className="order-1 min-w-[140px] rounded-[13px] bg-[var(--secondary)] px-10 py-3.5 text-[15px] font-bold text-white shadow-[0_6px_20px_rgba(193,49,148,0.35)] transition-[opacity,transform] enabled:hover:scale-[1.02] enabled:hover:shadow-[0_8px_24px_rgba(193,49,148,0.45)] disabled:cursor-not-allowed disabled:opacity-45 sm:order-2"
                  >
                    {submitting ? "Sending…" : "Submit"}
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
        )}
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-[5] flex items-end justify-between gap-4 bg-gradient-to-t from-white via-white to-transparent px-5 pb-6 pt-16 md:px-10 md:pb-8 md:pt-20">
        <p className="pointer-events-auto self-end text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--para-color)]">
          Step{" "}
          {step <= INTRO_STEPS ? step : step - INTRO_STEPS} of{" "}
          {step <= INTRO_STEPS ? INTRO_STEPS : QUESTION_STEPS}
        </p>
        <div
          className="pointer-events-auto flex flex-col gap-2"
          role="group"
          aria-label="Step navigation"
        >
          <button
            type="button"
            disabled={step <= 1}
            onClick={goPrev}
            className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--secondary)] text-white shadow-[0_4px_14px_rgba(193,49,148,0.35)] transition-[opacity,transform] hover:scale-[1.04] disabled:pointer-events-none disabled:opacity-35"
            aria-label="Previous step"
          >
            <ChevronUp className="h-5 w-5" strokeWidth={2.5} aria-hidden />
          </button>
          <button
            type="button"
            disabled={step >= TOTAL_STEPS}
            onClick={goNext}
            className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--secondary)] text-white shadow-[0_4px_14px_rgba(193,49,148,0.35)] transition-[opacity,transform] hover:scale-[1.04] disabled:pointer-events-none disabled:opacity-35"
            aria-label="Next step"
          >
            <ChevronDown className="h-5 w-5" strokeWidth={2.5} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
