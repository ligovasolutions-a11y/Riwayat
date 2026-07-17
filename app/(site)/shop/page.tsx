import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getPublishedBlock } from '@/lib/content';
import TabList from '@/components/site/TabList';
import ProductCard from '@/components/site/ProductCard';
import type { PageHeaderBlock, FiltersBlock } from '@/lib/blockTypes';
import { DEFAULT_PAGE_HEADER, DEFAULT_FILTERS } from '@/lib/blockDefaults';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await prisma.seoMeta.findUnique({ where: { page: 'shop' } });
  if (!seo) return {};
  return { title: seo.title, description: seo.description, keywords: seo.keywords };
}

const SWATCHES = ['#d4af37', '#e8c9c0', '#e5e4e2', '#6d1f2b'];

export default async function ShopPage() {
  const [pageHeader, filters, products] = await Promise.all([
    getPublishedBlock<PageHeaderBlock>('shop', 'page_header'),
    getPublishedBlock<FiltersBlock>('shop', 'filters'),
    prisma.product.findMany({ where: { enabled: true }, orderBy: { position: 'asc' } }),
  ]);

  const header = pageHeader || DEFAULT_PAGE_HEADER;
  const filterData = filters || DEFAULT_FILTERS;

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>{header.title}</h1>
          <div className="breadcrumb"><a href="/">Home</a> / {header.breadcrumb}</div>
        </div>
      </div>

      <section className="section">
        <div className="container shop-layout">
          <aside>
            <div className="filter-block">
              <h4>Category</h4>
              {filterData.categories.map((c, i) => (
                <label key={i}><input type="checkbox" defaultChecked={i === 0} /> {c}</label>
              ))}
            </div>
            <div className="filter-block">
              <h4>Metal</h4>
              {filterData.metals.map((m, i) => <label key={i}><input type="checkbox" /> {m}</label>)}
            </div>
            <div className="filter-block">
              <h4>Gemstone</h4>
              {filterData.gemstones.map((g, i) => <label key={i}><input type="checkbox" /> {g}</label>)}
            </div>
            <div className="filter-block">
              <h4>Price Range</h4>
              {filterData.priceRanges.map((p, i) => <label key={i}><input type="checkbox" /> {p}</label>)}
            </div>
            <div className="filter-block">
              <h4>Colour</h4>
              <div className="swatch-row">
                {SWATCHES.map((color, i) => <span key={i} className="swatch" style={{ background: color }} />)}
              </div>
            </div>
          </aside>

          <div>
            <div className="product-toolbar">
              <TabList tabs={['All', 'New Arrivals', 'Bestsellers', 'On Sale']} />
              <select className="sort-select" defaultValue="featured">
                <option value="featured">Sort By: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>

            <div className="product-grid">
              {products.map((p) => <ProductCard key={p.id} product={p} linked />)}
            </div>

            <div className="text-center" style={{ marginTop: 48 }}>
              <a href="#" className="btn">Load More</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
