import {TRANSITION_EASINGS} from "@nextui-org/framer-transitions";

export const modalStyle = {
    classNames:{ wrapper: "overflow-hidden", base: "md:max-h-[80vh]", body: "" },
    motionProps:{
        variants: {
            enter: {
                scale: 1,
                y: "var(--slide-enter)",
                opacity: 1,
                transition: {
                    scale: {
                        duration: 0.4,
                        ease: TRANSITION_EASINGS.ease,
                    },
                    opacity: {
                        duration: 0.4,
                        ease: TRANSITION_EASINGS.ease,
                    },
                    y: {
                        type: "spring",
                        bounce: 0,
                        duration: 0.6,
                    },
                },
            },
            exit: {
                scale: 1,
                y: "var(--slide-exit)",
                opacity: 0,
                transition: {
                    duration: 0.3,
                    ease: TRANSITION_EASINGS.ease,
                },
            },
        },
    }
}


export const scrollShadowProps = {
    hideScrollBar:true,
    size:10,
    className:"flex-1"
}

export const inputStyle = {
    startContent:"h-5 flex items-center opacity-70 mr-1"
}