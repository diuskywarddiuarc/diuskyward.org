"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";
import { useInteractionFeedback } from "@/lib/useInteractionFeedback";

interface CardProps {
    href: string;
    title: string;
    description: string;
    image?: string;
    category?: string;
    icon?: ReactNode;
}

export default function Card({ href, title, description, image, category, icon }: CardProps) {
    const { triggerHover, triggerClick } = useInteractionFeedback();

    return (
        <Link 
            href={href} 
            className="flex flex-col group h-full cursor-pointer focus-visible:outline-rl-white focus-visible:outline-2 focus-visible:outline-offset-8 rounded-lg"
            onClick={() => triggerClick(true, true)}
            onMouseEnter={() => triggerHover(false, false)}
            aria-label={`${category ? category + ': ' : ''}${title}. ${description}`}
        >
            {/* Visual Header Region */}
            <div className={`w-full relative overflow-hidden mb-6 flex items-center justify-center rounded-xl bg-[#0f0f0f] border border-rl-white/5 ${!image ? 'h-64' : ''}`}>
                {image ? (
                    <img
                        src={image}
                        alt={`Cover image for ${title}`}
                        className="w-full h-auto max-h-[400px] object-contain transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-rl-white/20 transition-transform duration-700 group-hover:scale-110">
                        {icon}
                    </div>
                )}
            </div>

            {/* Text Region */}
            <div className="flex flex-col flex-grow">
                {category && (
                    <span className="text-rl-light-grey/60 font-bold text-xs tracking-widest uppercase mb-3 block">
                        {category}
                    </span>
                )}
                <h3 className="text-2xl font-heading font-bold text-rl-white mb-4 line-clamp-2">
                    {title}
                </h3>
                <p className="text-rl-light-grey/80 text-sm leading-relaxed mb-6 flex-grow">
                    {description}
                </p>

                {/* Simple Link Button */}
                <div className="mt-auto flex items-center text-rl-white text-xs font-bold tracking-widest uppercase">
                    LEARN MORE
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
            </div>
        </Link>
    );
}
