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
//test
export const WelcomeNewsletter = () => {
    return (
        <Html>
            <Head />
            <Preview>Welcome to SoterCare Newsletter!</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Section className="mt-[32px] text-center">
                            <Heading className="text-[24px] font-bold text-black p-0 my-[30px] mx-0">
                                Welcome to SoterCare Newsletter!
                            </Heading>
                            <Text className="text-black text-[14px] leading-[24px]">
                                Hi there,
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                Thank you for subscribing to our newsletter. We're excited to have you on board!
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                Each week, we'll share updates on our journey, wellness tips, and exclusive insights into SoterCare.
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                Stay tuned for our next update!
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

export default WelcomeNewsletter;
