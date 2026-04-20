import icon01 from '@/public/images/faqs/01.png';
import icon02 from '@/public/images/faqs/02.png';
import icon03 from '@/public/images/faqs/03.png';
import icon04 from '@/public/images/faqs/04.png';
import icon05 from '@/public/images/faqs/05.png';
import { SprinkleParticles } from '../ui/SprinkleParticles';
import { MulticolorH2 } from "@/src/components/ui/MulticolorH2";


const faqItems = [
    {
        textHd: "#2294F2",
        icon: icon01,
        question: "How do I book the ice cream truck for my event?",
        answer: "Booking is simple! Just fill out our booking form or contact us directly with your event date, location, and estimated guest count. Our team will help you choose the perfect package for your event."
    },
    {
        textHd: "#81C9FA",
        icon: icon04,
        question: "What types of events do you serve?",
        answer: "Booking is simple! Just fill out our booking form or contact us directly with your event date, location, and estimated guest count. Our team will help you choose the perfect package for your event."
    },
    {
        textHd: "#72BD7E",
        icon: icon02,
        question: "How many guests can your packages serve?",
        answer: "Booking is simple! Just fill out our booking form or contact us directly with your event date, location, and estimated guest count. Our team will help you choose the perfect package for your event."
    },
    {
        textHd: "#C43293",
        icon: icon05,
        question: "How much does it cost to hire the truck?",
        answer: "The cost depends on the package you choose and the duration of your event. Reach out to us for a personalized quote based on your needs."
    },
    {
        textHd: "#E9AE77",
        icon: icon03,
        question: "Do you offer custom packages?",
        answer: "Booking is simple! Just fill out our booking form or contact us directly with your event date, location, and estimated guest count. Our team will help you choose the perfect package for your event."
    }
];

export default function Faqs() {
    return (
        <section id='reviews' className="faqs-sec relative">
            <div className="container">
            <SprinkleParticles seed={2026} />
                <div>
                    <MulticolorH2
                      className="sec-hd font-shine-bubble uppercase text-center mb-[50px] text-white"
                      sectionBackground="var(--background)"
                    >
                      FREQUENTLY ASKED QUESTIONS
                    </MulticolorH2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[50px]">
                    {faqItems.map((faq, index) => (
                        <div key={index} className="faq-item flex gap-[10px]">
                            <div>
                                <img src={faq.icon.src} width={80} height={80} className='max-w-[50px]' alt={`Icon ${index + 1}`} />
                            </div>
                            <div>
                                <h4 className="faqs-hd font-shine-bubble max-w-[560px] text-[28px] font-normal mb-[10px] uppercase"
                                style={{ color: faq.textHd }}
                                >
                                    {faq.question}
                                </h4>
                                <p className="text-para-color max-w-[560px] text-[18px] font-medium">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
