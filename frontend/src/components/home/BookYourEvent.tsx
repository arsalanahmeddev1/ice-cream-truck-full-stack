import shape01 from "@/public/images/book-your-event/01.png";
import shape02 from "@/public/images/book-your-event/02.png";
import shape03 from "@/public/images/book-your-event/03.png";
import shape04 from "@/public/images/book-your-event/04.png";
import shape05 from "@/public/images/book-your-event/05.png";
import shape06 from "@/public/images/book-your-event/06.png";
import { MulticolorH2 } from "@/src/components/ui/MulticolorH2";


type EventFormFieldProps = {
    type?: "text" | "email" | "date";
    name: string;
    placeholder: string;
};

function EventFormField({
    type = "text",
    name,
    placeholder,
}: EventFormFieldProps) {
    return (
        <label className="event-field">
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                required={type === "date"}
            />
        </label>
    );
}

const EVENT_FIELDS: EventFormFieldProps[] = [
    { name: "name", placeholder: "Your Name" },
    { type: "email", name: "email", placeholder: "Email Address" },
    { name: "address", placeholder: "Event Address" },
    { type: "date", name: "date", placeholder: "Event Date" },
];

/** Warm/beige section: Y + v were washing out; force readable brand hues (MulticolorH2 span syntax). */
const BOOK_YOUR_EVENT_HEADING =
    'Book <span style="color: #80C9EE">Y</span>our E<span style="color: #2294F2">v</span>ent';

export default function BookYourEvent() {
    return (
        <section id="contact" className="book-your-event-sec relative z-[1]">
            <img src={shape01.src} width={200} height={200} className="absolute top-0 left-0"  alt="" />
            <img src={shape02.src} width={150} height={150} className="absolute top-[60%] z-[-1] translate-y-[-60%] left-0"  alt="" />
            <img src={shape03.src} width={250} height={250} className="absolute bottom-[50px] mx-auto z-[-1] left-[-810px] right-0"  alt="" />
            <img src={shape04.src} width={250} height={250} className="absolute bottom-[90px] mx-auto z-[-1] left-0 right-[-540px]"  alt="" />
            <img src={shape05.src} width={250} height={250} className="absolute bottom-[90px] mx-auto z-[-1]  right-0"  alt="" />
            <img src={shape06.src} width={250} height={250} className="absolute top-[90px] mx-auto z-[-1]  right-0"  alt="" />
            <div className="container">
                <div className="mx-auto mb-12 max-w-[720px] text-center lg:mb-16">
                    <MulticolorH2
                        id="book-your-event-heading"
                        className="text-white sec-hd mb-[50px] font-shine-bubble"
                        sectionBackground="#e8cfae"
                    >
                        {BOOK_YOUR_EVENT_HEADING}
                    </MulticolorH2>
                </div>

                <form className="book-event-form max-w-[900px] mx-auto" action="#">
                    <div className="book-event-grid">
                        {EVENT_FIELDS.map((field) => (
                            <EventFormField key={field.name} {...field} />
                        ))}
                    </div>
                    <button type="submit" className="btn btn-theme book-event-submit packages-page-tabs__btn">
                        Submit
                    </button>
                </form>
            </div>
        </section>
    );
}