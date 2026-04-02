import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface ContactAutoReplyProps {
    senderName: string;
}

export const ContactAutoReply = ({
    senderName = "there",
}: ContactAutoReplyProps) => {
    return (
        <Html>
            <Head />
            <Preview>Thank you for reaching out to SoterCare</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Brand Header */}
                    <Section style={brandSection}>
                        <Heading style={brandText}>SOTERCARE</Heading>
                        <Text style={subheading}>WELLNESS SIMPLIFIED</Text>
                    </Section>

                    <Hr style={divider} />

                    {/* Content */}
                    <Section style={contentSection}>
                        <Heading style={contentHeading}>
                            Thank you, {senderName}!
                        </Heading>
                        <Text style={paragraph}>
                            We have received your message and appreciate you reaching out to us.
                        </Text>
                        <Text style={paragraph}>
                            One of our team members will review your message and get back to you as soon as possible. We typically respond within 24 hours.
                        </Text>
                    </Section>

                    {/* Info Box */}
                    <Section style={infoBox}>
                        <Text style={infoText}>
                            In the meantime, feel free to explore our website to learn more about how SoterCare is transforming elderly care with IoT and AI-powered solutions.
                        </Text>
                    </Section>

                    {/* Button */}
                    <Section style={buttonSection}>
                        <Link href="https://sotercare.com" style={button}>
                            Visit SoterCare
                        </Link>
                    </Section>

                    {/* Footer */}
                    <Section style={footerSection}>
                        <Text style={footerLinks}>
                            <Link href="https://www.linkedin.com/company/sotercare/" style={link}>LinkedIn</Link>
                            &nbsp;&nbsp;•&nbsp;&nbsp;
                            <Link href="https://www.instagram.com/sotercare_/" style={link}>Instagram</Link>
                            &nbsp;&nbsp;•&nbsp;&nbsp;
                            <Link href="mailto:support@sotercare.com" style={link}>Mail Us</Link>
                        </Text>
                        <Text style={copyright}>
                            © {new Date().getFullYear()} SoterCare. Wellness Simplified.
                        </Text>
                        <Text style={disclaimer}>
                            This is an automated response. Please do not reply directly to this email.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

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
    marginBottom: '10px',
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
    color: '#a0cbdb',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    fontWeight: '600',
};

const divider = {
    borderColor: '#eeeeee',
    margin: '20px 0',
};

const contentSection = {
    textAlign: 'center' as const,
    marginBottom: '24px',
};

const contentHeading = {
    fontSize: '22px',
    margin: '0 0 16px 0',
    fontWeight: '600',
    color: '#1a1a1a',
};

const paragraph = {
    color: '#797979',
    fontSize: '15px',
    lineHeight: '1.7',
    margin: '0 0 12px 0',
};

const infoBox = {
    backgroundColor: '#f0f9fc',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '30px',
};

const infoText = {
    margin: '0',
    fontSize: '14px',
    color: '#555555',
    lineHeight: '1.6',
    textAlign: 'center' as const,
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
    paddingTop: '24px',
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
    margin: '0 0 4px 0',
    fontSize: '12px',
    color: '#aaaaaa',
};

const disclaimer = {
    margin: '8px 0 0 0',
    fontSize: '11px',
    color: '#cccccc',
    fontStyle: 'italic',
};

export default ContactAutoReply;
