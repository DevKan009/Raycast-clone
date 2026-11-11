const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const html = fs.readFileSync('reference/page.html', 'utf8');
const $ = cheerio.load(html);

const rootChildren = $('#root').children();

const sectionsData = [];

rootChildren.each((i, el) => {
  const elem = $(el);
  const tag = el.tagName;
  const className = elem.attr('class') || '';
  const id = elem.attr('id') || '';
  
  const text = elem.text().trim().replace(/\s+/g, ' ');
  const headings = elem.find('h1, h2, h3, h4, h5, h6').map((_, h) => ({
    tag: h.tagName,
    text: $(h).text().trim().replace(/\s+/g, ' ')
  })).get();

  const links = elem.find('a').map((_, a) => ({
    text: $(a).text().trim().replace(/\s+/g, ' '),
    href: $(a).attr('href'),
    ariaLabel: $(a).attr('aria-label'),
    title: $(a).attr('title')
  })).get();

  const buttons = elem.find('button').map((_, b) => ({
    text: $(b).text().trim().replace(/\s+/g, ' '),
    ariaLabel: $(b).attr('aria-label')
  })).get();

  const images = elem.find('img').map((_, img) => ({
    src: $(img).attr('src'),
    alt: $(img).attr('alt') || '',
    width: $(img).attr('width') || '',
    height: $(img).attr('height') || ''
  })).get();

  const svgCount = elem.find('svg').length;

  sectionsData.push({
    index: i,
    tag,
    id,
    className,
    headings,
    linksCount: links.length,
    links: links.slice(0, 15),
    buttons,
    imageCount: images.length,
    images: images.slice(0, 10),
    svgCount,
    textPreview: text.slice(0, 300)
  });
});

fs.writeFileSync('reference/sections_inventory.json', JSON.stringify(sectionsData, null, 2));
console.log('Saved sections inventory to reference/sections_inventory.json');
