import { Flex } from '@chakra-ui/react';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import React, { FC, useEffect, useRef, useState } from 'react';

const setCheckboxes = (str: string) =>
  str
    .replace(/(\[x\])/gim, '\t<input type="checkbox" checked>')
    .replace(/(\[ \])/gim, '\t<input type="checkbox">');

const addBlankToLinkTag = (str: string) =>
  str.replace(/(<a)/gim, '$1 target="_blank"');

export const GuidePage: FC = () => {
  const [markdown, setMarkdown] = useState<string>('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function getMarkdown() {
      const { data: md } = await axios.get(`/daos/guide.md`);
      setMarkdown(md);
    }

    getMarkdown();
  }, []);

  useEffect(() => {
    if (!markdown?.length) return;
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
            ${addBlankToLinkTag(setCheckboxes(md.render(markdown)))}`;
          }
        }
      );
      const shadow = document.createElement('faq-markdown');
      ref.current?.appendChild(shadow);
    } catch (err) {
      // dev is defining twice so this is necessary
    }
  }, [markdown]);

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
        w={{ base: 'full' }}
        maxW={{ base: '400px', md: '820px', lg: '944px', xl: '1360px' }}
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
