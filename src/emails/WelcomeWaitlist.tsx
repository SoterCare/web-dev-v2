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
} from "@react-email/components";
import * as React from "react";

export const WelcomeWaitlist = () => {
    return (
        <Html>
            <Head />
            <Preview>You're on the list!</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Brand Header */}
                    <Section style={brandSection}>
                        <Heading style={brandText}>SOTERCARE</Heading>
                        <Text style={subheading}>WAITLIST CONFIRMATION</Text>
                    </Section>

                    {/* Content */}
                    <Section style={contentSection}>
                        <Heading style={contentHeading}>You're on the list!</Heading>
                        <Text style={paragraph}>
                            Thanks for joining the SoterCare waitlist. We've saved your spot!
                        </Text>
                        <Text style={paragraph}>
                            We're working hard to get everything ready. You'll be the first to know as soon as spots open up.
                        </Text>
                    </Section>

                    {/* Button */}
                    <Section style={buttonSection}>
                        <Link href="https://links.sotercare.com" style={button}>
                            Discover Sotercare
                        </Link>
                    </Section>

                    {/* Footer Flow (Unified) */}
                    <Section style={footerSection}>
                        <Text style={footerLinks}>
                            <Link href="https://www.linkedin.com/company/sotercare/" style={link}>LinkedIn</Link>
                            &nbsp;&nbsp;•&nbsp;&nbsp;
                            <Link href="https://www.instagram.com/sotercare_/" style={link}>Instagram</Link>
                            &nbsp;&nbsp;•&nbsp;&nbsp;
                            <Link href="mailto:support@sotercare.com" style={link}>Mail Us</Link>
                        </Text>
                        <Text style={copyright}>
                            © 2026 SoterCare. Wellness Simplified.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

// CSS-only Styles
const main = {
    backgroundColor: '#fafafa',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    padding: '40px 0',
};

const container = {
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    margin: '0 auto',
    maxWidth: '600px',
    padding: '40px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
};

const brandSection = {
    textAlign: 'center' as const,
    marginBottom: '30px',
};

const brandText = {
    margin: '0',
    fontSize: '24px',
    letterSpacing: '4px',
    fontWeight: '800',
    color: '#000000',
    textTransform: 'uppercase' as const,
};

const subheading = {
    margin: '8px 0 0 0',
    fontSize: '12px',
    color: '#797979',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    fontWeight: '500',
};

const contentSection = {
    textAlign: 'center' as const,
    marginBottom: '30px',
};

const contentHeading = {
    fontSize: '22px',
    margin: '0 0 15px 0',
    fontWeight: '600',
    color: '#1a1a1a',
};

const paragraph = {
    color: '#797979',
    fontSize: '16px',
    lineHeight: '1.6',
    margin: '0 0 15px 0',
};

const buttonSection = {
    textAlign: 'center' as const,
    marginBottom: '40px',
};

const button = {
    backgroundColor: '#a0cbdb',
    borderRadius: '6px',
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '1px',
    padding: '16px 32px',
    textDecoration: 'none',
    textTransform: 'uppercase' as const,
};

const footerSection = {
    textAlign: 'center' as const,
    borderTop: '1px solid #eeeeee',
    paddingTop: '30px',
};

const footerLinks = {
    margin: '0 0 15px 0',
    fontSize: '14px',
    color: '#666666',
};

const link = {
    color: '#666666',
    textDecoration: 'none',
    fontWeight: '500',
};

const copyright = {
    margin: '0',
    fontSize: '12px',
    color: '#aaaaaa',
};

export default WelcomeWaitlist;
