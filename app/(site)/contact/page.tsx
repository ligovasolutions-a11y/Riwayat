import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getPublishedBlock } from '@/lib/content';
import { IconGlyph } from '@/lib/icons';
import ContactForm from '@/components/site/ContactForm';
import Accordion from '@/components/site/Accordion';
import type { PageHeaderBlock, InfoCardsBlock, FaqsBlock, ContactFormBlock } from '@/lib/blockTypes';
import { DEFAULT_PAGE_HEADER, DEFAULT_INFO_CARDS, DEFAULT_FAQS, DEFAULT_CONTACT_FORM } from '@/lib/blockDefaults';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await prisma.seoMeta.findUnique({ where: { page: 'contact' } });
  if (!seo) return {};
  return { title: seo.title, description: seo.description, keywords: seo.keywords };
}

export default async function ContactPage() {
  const [pageHeader, infoCards, faqs, contactForm] = await Promise.all([
    getPublishedBlock<PageHeaderBlock>('contact', 'page_header'),
    getPublishedBlock<InfoCardsBlock>('contact', 'info_cards'),
    getPublishedBlock<FaqsBlock>('contact', 'faqs'),
    getPublishedBlock<ContactFormBlock>('contact', 'contact_form'),
  ]);

  const header = pageHeader || DEFAULT_PAGE_HEADER;
  const infoData = infoCards || DEFAULT_INFO_CARDS;
  const faqData = faqs || DEFAULT_FAQS;
  const formData = contactForm || DEFAULT_CONTACT_FORM;

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>{header.title}</h1>
          <div className="breadcrumb"><Link href="/">Home</Link> / {header.breadcrumb}</div>
        </div>
      </div>

      <section className="section">
        <div className="container contact-grid">
          <ContactForm data={formData} />

          <div>
            <h2 style={{ marginBottom: 24 }}>Get In Touch</h2>
            {infoData.items.map((item, i) => (
              <div key={i} className="info-card">
                <IconGlyph name={item.icon} />
                <div>
                  <h4>{item.title}</h4>
                  <p dangerouslySetInnerHTML={{ __html: item.text }} />
                </div>
              </div>
            ))}
            <div className="map-block">Store Location Map</div>
          </div>
        </div>
      </section>

      {faqData.items.length > 0 && (
        <section className="section section-alt">
          <div className="container" style={{ maxWidth: 800 }}>
            <div className="section-heading">
              <span className="eyebrow">{faqData.eyebrow}</span>
              <h2>{faqData.heading}</h2>
            </div>
            <Accordion items={faqData.items.map((f) => ({ title: f.question, content: f.answer }))} />
          </div>
        </section>
      )}
    </>
  );
}
