import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
} from "@react-email/components";
import * as React from "react";

export const WelcomeWaitlist = () => {
    return (
        <Html>
            <Head />
            <Preview>You're on the SoterCare Waitlist!</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Section className="mt-[32px] text-center">
                            <Heading className="text-[24px] font-bold text-black p-0 my-[30px] mx-0">
                                You're on the list!
                            </Heading>
                            <Text className="text-black text-[14px] leading-[24px]">
                                Hi there,
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                Thanks for joining the SoterCare waitlist. We've saved your spot!
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                We're working hard to get everything ready. You'll be the first to know as soon as spots open up.
                            </Text>
                        </Section>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Link
                                className="px-5 py-3 rounded-full bg-[#a0cbdb] text-white font-bold no-underline text-center"
                                href="https://sotercare.com"
                            >
                                Visit Website
                            </Link>
                        </Section>
                        <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
                            © {new Date().getFullYear()} SoterCare. All rights reserved.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default WelcomeWaitlist;
