'use client';

import { useToast } from '@/components/admin/CsrfContext';
import Toast from '@/components/admin/Toast';
import BlockEditorCard from '@/components/admin/BlockEditorCard';
import { TextField, TextAreaField, ParagraphsField, LinesField, IconPicker, RepeatingList } from '@/components/admin/fields';
import type {
  HeroBlock, TrustStripBlock, CategoriesBlock, CollectionsBlock, StoryBlock, TestimonialsBlock, NewsletterBlock,
  PageHeaderBlock, FiltersBlock, HeroStoryBlock, ValuesBlock, AtelierBlock, InfoCardsBlock, FaqsBlock, ContactFormBlock,
  NavBlock, FooterBlock, ContactInfoBlock,
} from '@/lib/blockTypes';

type BlockRow = { id: number; blockKey: string; label: string; draftJson: string; publishedJson: string; enabled: boolean };

const PREVIEW_HREF: Record<string, string> = { home: '/', shop: '/shop', about: '/about', contact: '/contact', global: '/' };

export default function PageBlocksEditor({ page, blocks }: { page: string; blocks: BlockRow[] }) {
  const { message, show } = useToast();
  const previewHref = PREVIEW_HREF[page] || '/';

  return (
    <>
      {blocks.map((block) => {
        const draft = JSON.parse(block.draftJson);
        const published = JSON.parse(block.publishedJson);
        const common = {
          key: block.id, blockId: block.id, label: block.label, initialEnabled: block.enabled,
          previewHref, onToast: show,
        };

        switch (block.blockKey) {
          case 'hero':
            return (
              <BlockEditorCard<HeroBlock> {...common} initialDraft={draft} initialPublished={published}
                renderFields={(d, set) => (
                  <>
                    <TextField label="Eyebrow" value={d.eyebrow} onChange={(v) => set({ ...d, eyebrow: v })} />
                    <TextField label="Heading (you may use <em>word</em> for italic emphasis)" value={d.heading} onChange={(v) => set({ ...d, heading: v })} />
                    <TextAreaField label="Description" value={d.description} onChange={(v) => set({ ...d, description: v })} />
                    <div className="a-row">
                      <TextField label="Primary Button Text" value={d.primaryBtnText} onChange={(v) => set({ ...d, primaryBtnText: v })} />
                      <TextField label="Primary Button Link" value={d.primaryBtnHref} onChange={(v) => set({ ...d, primaryBtnHref: v })} />
                    </div>
                    <div className="a-row">
                      <TextField label="Secondary Button Text" value={d.secondaryBtnText} onChange={(v) => set({ ...d, secondaryBtnText: v })} />
                      <TextField label="Secondary Button Link" value={d.secondaryBtnHref} onChange={(v) => set({ ...d, secondaryBtnHref: v })} />
                    </div>
                  </>
                )} />
            );

          case 'trust_strip':
            return (
              <BlockEditorCard<TrustStripBlock> {...common} initialDraft={draft} initialPublished={published}
                renderFields={(d, set) => <LinesField label="Strip Items" value={d.items} onChange={(v) => set({ items: v })} />} />
            );

          case 'categories':
            return (
              <BlockEditorCard<CategoriesBlock> {...common} initialDraft={draft} initialPublished={published}
                renderFields={(d, set) => (
                  <>
                    <TextField label="Eyebrow" value={d.eyebrow} onChange={(v) => set({ ...d, eyebrow: v })} />
                    <TextField label="Heading" value={d.heading} onChange={(v) => set({ ...d, heading: v })} />
                    <TextAreaField label="Description" value={d.description} onChange={(v) => set({ ...d, description: v })} />
                    <label>Categories</label>
                    <RepeatingList items={d.items} onChange={(items) => set({ ...d, items })}
                      newItem={() => ({ label: 'New Category', icon: 'ring', href: '/shop' })}
                      itemLabel={(item) => item.label}
                      renderItem={(item, update) => (
                        <>
                          <div className="a-row">
                            <TextField label="Label" value={item.label} onChange={(v) => update({ label: v })} />
                            <TextField label="Link" value={item.href} onChange={(v) => update({ href: v })} />
                          </div>
                          <IconPicker label="Icon" value={item.icon} onChange={(v) => update({ icon: v })} />
                        </>
                      )} addLabel="+ Add Category" />
                  </>
                )} />
            );

          case 'collections':
            return (
              <BlockEditorCard<CollectionsBlock> {...common} initialDraft={draft} initialPublished={published}
                renderFields={(d, set) => (
                  <>
                    <TextField label="Eyebrow" value={d.eyebrow} onChange={(v) => set({ ...d, eyebrow: v })} />
                    <TextField label="Heading" value={d.heading} onChange={(v) => set({ ...d, heading: v })} />
                    <label>Collection Banners</label>
                    <RepeatingList items={d.items} onChange={(items) => set({ ...d, items })}
                      newItem={() => ({ tag: 'New', title: 'New Collection', href: '/shop', variant: '' })}
                      itemLabel={(item) => item.title}
                      renderItem={(item, update) => (
                        <>
                          <div className="a-row">
                            <TextField label="Tag" value={item.tag} onChange={(v) => update({ tag: v })} />
                            <TextField label="Title" value={item.title} onChange={(v) => update({ title: v })} />
                          </div>
                          <TextField label="Link" value={item.href} onChange={(v) => update({ href: v })} />
                        </>
                      )} addLabel="+ Add Banner" />
                  </>
                )} />
            );

          case 'story':
            return (
              <BlockEditorCard<StoryBlock> {...common} initialDraft={draft} initialPublished={published}
                renderFields={(d, set) => (
                  <>
                    <TextField label="Eyebrow" value={d.eyebrow} onChange={(v) => set({ ...d, eyebrow: v })} />
                    <TextField label="Heading" value={d.heading} onChange={(v) => set({ ...d, heading: v })} />
                    <ParagraphsField label="Paragraphs" value={d.paragraphs} onChange={(v) => set({ ...d, paragraphs: v })} />
                    <div className="a-row">
                      <TextField label="Button Text" value={d.buttonText} onChange={(v) => set({ ...d, buttonText: v })} />
                      <TextField label="Button Link" value={d.buttonHref} onChange={(v) => set({ ...d, buttonHref: v })} />
                    </div>
                    <label>Stats</label>
                    <RepeatingList items={d.stats} onChange={(stats) => set({ ...d, stats })}
                      newItem={() => ({ num: '0', label: 'New Stat' })}
                      itemLabel={(item) => item.label}
                      renderItem={(item, update) => (
                        <div className="a-row">
                          <TextField label="Number" value={item.num} onChange={(v) => update({ num: v })} />
                          <TextField label="Label" value={item.label} onChange={(v) => update({ label: v })} />
                        </div>
                      )} addLabel="+ Add Stat" />
                  </>
                )} />
            );

          case 'testimonials':
            return (
              <BlockEditorCard<TestimonialsBlock> {...common} initialDraft={draft} initialPublished={published}
                renderFields={(d, set) => (
                  <>
                    <TextField label="Eyebrow" value={d.eyebrow} onChange={(v) => set({ ...d, eyebrow: v })} />
                    <TextField label="Heading" value={d.heading} onChange={(v) => set({ ...d, heading: v })} />
                    <label>Testimonials</label>
                    <RepeatingList items={d.items} onChange={(items) => set({ ...d, items })}
                      newItem={() => ({ quote: '', author: '', rating: 5 })}
                      itemLabel={(item) => item.author || 'New testimonial'}
                      renderItem={(item, update) => (
                        <>
                          <TextAreaField label="Quote" value={item.quote} onChange={(v) => update({ quote: v })} />
                          <div className="a-row">
                            <TextField label="Author" value={item.author} onChange={(v) => update({ author: v })} />
                            <TextField label="Rating (1-5)" value={String(item.rating)} onChange={(v) => update({ rating: Number(v) || 5 })} />
                          </div>
                        </>
                      )} addLabel="+ Add Testimonial" />
                  </>
                )} />
            );

          case 'newsletter':
            return (
              <BlockEditorCard<NewsletterBlock> {...common} initialDraft={draft} initialPublished={published}
                renderFields={(d, set) => (
                  <>
                    <TextField label="Heading" value={d.heading} onChange={(v) => set({ ...d, heading: v })} />
                    <TextAreaField label="Description" value={d.description} onChange={(v) => set({ ...d, description: v })} />
                    <TextField label="Button Text" value={d.buttonText} onChange={(v) => set({ ...d, buttonText: v })} />
                  </>
                )} />
            );

          case 'page_header':
            return (
              <BlockEditorCard<PageHeaderBlock> {...common} initialDraft={draft} initialPublished={published}
                renderFields={(d, set) => (
                  <div className="a-row">
                    <TextField label="Title" value={d.title} onChange={(v) => set({ ...d, title: v })} />
                    <TextField label="Breadcrumb Label" value={d.breadcrumb} onChange={(v) => set({ ...d, breadcrumb: v })} />
                  </div>
                )} />
            );

          case 'filters':
            return (
              <BlockEditorCard<FiltersBlock> {...common} initialDraft={draft} initialPublished={published}
                renderFields={(d, set) => (
                  <>
                    <LinesField label="Categories" value={d.categories} onChange={(v) => set({ ...d, categories: v })} />
                    <LinesField label="Metals" value={d.metals} onChange={(v) => set({ ...d, metals: v })} />
                    <LinesField label="Gemstones" value={d.gemstones} onChange={(v) => set({ ...d, gemstones: v })} />
                    <LinesField label="Price Ranges" value={d.priceRanges} onChange={(v) => set({ ...d, priceRanges: v })} />
                  </>
                )} />
            );

          case 'hero_story':
            return (
              <BlockEditorCard<HeroStoryBlock> {...common} initialDraft={draft} initialPublished={published}
                renderFields={(d, set) => (
                  <>
                    <TextField label="Eyebrow" value={d.eyebrow} onChange={(v) => set({ ...d, eyebrow: v })} />
                    <TextField label="Heading" value={d.heading} onChange={(v) => set({ ...d, heading: v })} />
                    <ParagraphsField label="Paragraphs" value={d.paragraphs} onChange={(v) => set({ ...d, paragraphs: v })} />
                    <TextField label="Monogram Letter/Symbol" value={d.monogram} onChange={(v) => set({ ...d, monogram: v })} />
                    <label>Stats</label>
                    <RepeatingList items={d.stats} onChange={(stats) => set({ ...d, stats })}
                      newItem={() => ({ num: '0', label: 'New Stat' })}
                      itemLabel={(item) => item.label}
                      renderItem={(item, update) => (
                        <div className="a-row">
                          <TextField label="Number" value={item.num} onChange={(v) => update({ num: v })} />
                          <TextField label="Label" value={item.label} onChange={(v) => update({ label: v })} />
                        </div>
                      )} addLabel="+ Add Stat" />
                  </>
                )} />
            );

          case 'values':
            return (
              <BlockEditorCard<ValuesBlock> {...common} initialDraft={draft} initialPublished={published}
                renderFields={(d, set) => (
                  <>
                    <TextField label="Eyebrow" value={d.eyebrow} onChange={(v) => set({ ...d, eyebrow: v })} />
                    <TextField label="Heading" value={d.heading} onChange={(v) => set({ ...d, heading: v })} />
                    <label>Value Cards</label>
                    <RepeatingList items={d.items} onChange={(items) => set({ ...d, items })}
                      newItem={() => ({ icon: 'shield', title: 'New Value', text: '' })}
                      itemLabel={(item) => item.title}
                      renderItem={(item, update) => (
                        <>
                          <IconPicker label="Icon" value={item.icon} onChange={(v) => update({ icon: v })} />
                          <TextField label="Title" value={item.title} onChange={(v) => update({ title: v })} />
                          <TextAreaField label="Text" value={item.text} onChange={(v) => update({ text: v })} />
                        </>
                      )} addLabel="+ Add Value" />
                  </>
                )} />
            );

          case 'atelier':
            return (
              <BlockEditorCard<AtelierBlock> {...common} initialDraft={draft} initialPublished={published}
                renderFields={(d, set) => (
                  <>
                    <TextField label="Eyebrow" value={d.eyebrow} onChange={(v) => set({ ...d, eyebrow: v })} />
                    <TextField label="Heading" value={d.heading} onChange={(v) => set({ ...d, heading: v })} />
                    <ParagraphsField label="Paragraphs" value={d.paragraphs} onChange={(v) => set({ ...d, paragraphs: v })} />
                    <TextField label="Monogram Letter/Symbol" value={d.monogram} onChange={(v) => set({ ...d, monogram: v })} />
                    <div className="a-row">
                      <TextField label="Button Text" value={d.buttonText} onChange={(v) => set({ ...d, buttonText: v })} />
                      <TextField label="Button Link" value={d.buttonHref} onChange={(v) => set({ ...d, buttonHref: v })} />
                    </div>
                  </>
                )} />
            );

          case 'info_cards':
            return (
              <BlockEditorCard<InfoCardsBlock> {...common} initialDraft={draft} initialPublished={published}
                renderFields={(d, set) => (
                  <RepeatingList items={d.items} onChange={(items) => set({ items })}
                    newItem={() => ({ icon: 'location', title: 'New Info', text: '' })}
                    itemLabel={(item) => item.title}
                    renderItem={(item, update) => (
                      <>
                        <IconPicker label="Icon" value={item.icon} onChange={(v) => update({ icon: v })} />
                        <TextField label="Title" value={item.title} onChange={(v) => update({ title: v })} />
                        <TextField label="Text (use <br> for a line break)" value={item.text} onChange={(v) => update({ text: v })} />
                      </>
                    )} addLabel="+ Add Info Card" />
                )} />
            );

          case 'faqs':
            return (
              <BlockEditorCard<FaqsBlock> {...common} initialDraft={draft} initialPublished={published}
                renderFields={(d, set) => (
                  <>
                    <TextField label="Eyebrow" value={d.eyebrow} onChange={(v) => set({ ...d, eyebrow: v })} />
                    <TextField label="Heading" value={d.heading} onChange={(v) => set({ ...d, heading: v })} />
                    <label>Questions</label>
                    <RepeatingList items={d.items} onChange={(items) => set({ ...d, items })}
                      newItem={() => ({ question: 'New question?', answer: '' })}
                      itemLabel={(item) => item.question}
                      renderItem={(item, update) => (
                        <>
                          <TextField label="Question" value={item.question} onChange={(v) => update({ question: v })} />
                          <TextAreaField label="Answer" value={item.answer} onChange={(v) => update({ answer: v })} />
                        </>
                      )} addLabel="+ Add Question" />
                  </>
                )} />
            );

          case 'contact_form':
            return (
              <BlockEditorCard<ContactFormBlock> {...common} initialDraft={draft} initialPublished={published}
                renderFields={(d, set) => <TextField label="Form Heading" value={d.title} onChange={(v) => set({ title: v })} />} />
            );

          case 'nav':
            return (
              <BlockEditorCard<NavBlock> {...common} initialDraft={draft} initialPublished={published}
                renderFields={(d, set) => (
                  <>
                    <div className="a-row">
                      <TextField label="Logo Line 1" value={d.logoLine1} onChange={(v) => set({ ...d, logoLine1: v })} />
                      <TextField label="Logo Line 2" value={d.logoLine2} onChange={(v) => set({ ...d, logoLine2: v })} />
                    </div>
                    <TextField label="Tagline" value={d.tagline} onChange={(v) => set({ ...d, tagline: v })} />
                    <TextField label="Top Bar Announcement" value={d.announcement} onChange={(v) => set({ ...d, announcement: v })} />
                    <label>Main Menu Items</label>
                    <RepeatingList items={d.items} onChange={(items) => set({ ...d, items })}
                      newItem={() => ({ label: 'New Link', href: '/shop' })}
                      itemLabel={(item) => item.label}
                      renderItem={(item, update) => (
                        <div className="a-row">
                          <TextField label="Label" value={item.label} onChange={(v) => update({ label: v })} />
                          <TextField label="Link" value={item.href} onChange={(v) => update({ href: v })} />
                        </div>
                      )} addLabel="+ Add Menu Item" />
                    <label>Top Bar — Left Links</label>
                    <RepeatingList items={d.topbarLeft} onChange={(topbarLeft) => set({ ...d, topbarLeft })}
                      newItem={() => ({ label: 'New Link', href: '/' })}
                      itemLabel={(item) => item.label}
                      renderItem={(item, update) => (
                        <div className="a-row">
                          <TextField label="Label" value={item.label} onChange={(v) => update({ label: v })} />
                          <TextField label="Link" value={item.href} onChange={(v) => update({ href: v })} />
                        </div>
                      )} addLabel="+ Add Link" />
                    <label>Top Bar — Right Links</label>
                    <RepeatingList items={d.topbarRight} onChange={(topbarRight) => set({ ...d, topbarRight })}
                      newItem={() => ({ label: 'New Link', href: '/' })}
                      itemLabel={(item) => item.label}
                      renderItem={(item, update) => (
                        <div className="a-row">
                          <TextField label="Label" value={item.label} onChange={(v) => update({ label: v })} />
                          <TextField label="Link" value={item.href} onChange={(v) => update({ href: v })} />
                        </div>
                      )} addLabel="+ Add Link" />
                  </>
                )} />
            );

          case 'footer':
            return (
              <BlockEditorCard<FooterBlock> {...common} initialDraft={draft} initialPublished={published}
                renderFields={(d, set) => (
                  <>
                    <TextAreaField label="About Text" value={d.aboutText} onChange={(v) => set({ ...d, aboutText: v })} />
                    <TextField label="Copyright Line" value={d.copyright} onChange={(v) => set({ ...d, copyright: v })} />
                    <LinesField label="Accepted Payment Labels" value={d.payments} onChange={(v) => set({ ...d, payments: v })} />
                    <label>Social Links</label>
                    <RepeatingList items={d.social} onChange={(social) => set({ ...d, social })}
                      newItem={() => ({ platform: 'Instagram', href: '#' })}
                      itemLabel={(item) => item.platform}
                      renderItem={(item, update) => (
                        <div className="a-row">
                          <div className="a-field">
                            <label>Platform</label>
                            <select value={item.platform} onChange={(e) => update({ platform: e.target.value })}>
                              {['Instagram', 'Facebook', 'Pinterest', 'WhatsApp'].map((p) => <option key={p} value={p}>{p}</option>)}
                            </select>
                          </div>
                          <TextField label="Link" value={item.href} onChange={(v) => update({ href: v })} />
                        </div>
                      )} addLabel="+ Add Social Link" />
                    <label>Footer Columns</label>
                    <RepeatingList items={d.columns} onChange={(columns) => set({ ...d, columns })}
                      newItem={() => ({ title: 'New Column', links: [] })}
                      itemLabel={(item) => item.title}
                      renderItem={(item, update) => (
                        <>
                          <TextField label="Column Title" value={item.title} onChange={(v) => update({ title: v })} />
                          <label>Links</label>
                          <RepeatingList items={item.links} onChange={(links) => update({ links })}
                            newItem={() => ({ label: 'New Link', href: '/' })}
                            itemLabel={(l) => l.label}
                            renderItem={(l, updateLink) => (
                              <div className="a-row">
                                <TextField label="Label" value={l.label} onChange={(v) => updateLink({ label: v })} />
                                <TextField label="Link" value={l.href} onChange={(v) => updateLink({ href: v })} />
                              </div>
                            )} addLabel="+ Add Link" />
                        </>
                      )} addLabel="+ Add Column" />
                  </>
                )} />
            );

          case 'contact_info':
            return (
              <BlockEditorCard<ContactInfoBlock> {...common} initialDraft={draft} initialPublished={published}
                renderFields={(d, set) => (
                  <>
                    <TextField label="Address" value={d.address} onChange={(v) => set({ ...d, address: v })} />
                    <div className="a-row">
                      <TextField label="Phone" value={d.phone} onChange={(v) => set({ ...d, phone: v })} />
                      <TextField label="Phone Hours Note" value={d.phoneHours} onChange={(v) => set({ ...d, phoneHours: v })} />
                    </div>
                    <TextField label="Email" value={d.email} onChange={(v) => set({ ...d, email: v })} />
                    <div className="a-row">
                      <TextField label="Weekday Hours" value={d.hoursWeekday} onChange={(v) => set({ ...d, hoursWeekday: v })} />
                      <TextField label="Weekend Hours" value={d.hoursWeekend} onChange={(v) => set({ ...d, hoursWeekend: v })} />
                    </div>
                  </>
                )} />
            );

          default:
            return null;
        }
      })}
      <Toast message={message} />
    </>
  );
}
