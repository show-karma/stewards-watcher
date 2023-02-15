import { Flex } from '@chakra-ui/react';
import MarkdownIt from 'markdown-it';
import React, { FC, useEffect, useRef } from 'react';

interface IFAQPage {
  markdown: string;
}

const setCheckboxes = (str: string) =>
  str
    .replace(/(\[x\])/gim, '\t<input type="checkbox" checked>')
    .replace(/(\[ \])/gim, '\t<input type="checkbox">');

export const FAQPage: FC<IFAQPage> = ({ markdown }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try {
      const md = new MarkdownIt();
      customElements.define(
        'faq-markdown',
        class extends HTMLElement {
          connectedCallback() {
            // eslint-disable-next-line react/no-this-in-sfc
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = `
            <style>
              pre,code{background:rgba(155,155,155,0.125);font-size:1.2em;border-radius:8px;padding:0 10px}
              pre{padding:10px;font-size:1.2em}
              pre code {background:transparent;padding:0}
              table{border:1px solid rgba(155,155,155,0.125);border-radius:8px}
              table tr td{padding:0 10px}
              table tr:nth-of-type(2n-1){border-bottom:1px solid;background:rgba(155,155,155,0.125)}
              table tr:nth-of-type(2n){border-bottom:1px solid;background:rgba(155,155,155,0.225)}
            </style>
            ${setCheckboxes(md.render(markdown))}`;
          }
        }
      );
      const shadow = document.createElement('faq-markdown');
      ref.current?.appendChild(shadow);
    } catch (err) {
      // dev is defining twice so this is necessary
    }
  }, []);

  return (
    <Flex
      alignItems="center"
      w={{ base: 'full' }}
      py="8"
      px={{ base: '4', lg: '20' }}
      flexDir="column"
    >
      <Flex
        ref={ref}
        w={{ base: 'full', '2xl': '1360px' }}
        flexDir="column"
        sx={{
          'ol, ul': {
            marginLeft: '32px',
          },
          // eslint-disable-next-line id-length
          a: {
            color: 'blue.400',
          },
        }}
        align="left"
      />
    </Flex>
  );
};
