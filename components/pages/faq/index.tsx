/* eslint-disable no-useless-escape */
import { Flex } from '@chakra-ui/react';
import axios from 'axios';
import { useDAO } from 'contexts';
import MarkdownIt from 'markdown-it';
import React, { FC, useEffect, useRef, useState } from 'react';

const setCollapsibles = (str: string) =>
  str
    .replace(/\n/gim, '')
    .replace(
      /\-\-summary\-\-(.*?)\-\-\/summary\-\-/g,
      (_, p1) => `<h3 class="title"> <span class="icon">&gt;</span> ${p1}</h3>`
    )
    // replace whats between <details>and </details> with <div class="content">$1</div>
    .replace(
      /\-\-details\-\-(.*?)\-\-\/details\-\-/g,
      (_, p1) =>
        `<div class="collapsible"><div class="content">${p1}</div></div>`
    );

const setCheckboxes = (str: string) =>
  str
    .replace(/(\[x\])/gim, '\t<input type="checkbox" checked>')
    .replace(/(\[ \])/gim, '\t<input type="checkbox">');

const addBlankToLinkTag = (str: string) =>
  str.replace(/(<a)/gim, '$1 target="_blank"');

export const FAQPage: FC = () => {
  const [markdown, setMarkdown] = useState<string>('');
  const { selectedDAO } = useDAO();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function getMarkdown() {
      const { data: md } = await axios.get(`/daos/${selectedDAO}/faq.md`);
      setMarkdown(md);
    }

    getMarkdown();
  }, []);

  useEffect(() => {
    if (!markdown?.length) return;
    try {
      const md = new MarkdownIt();
      if (!customElements.get('faq-markdown')) {
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
              .collapsible{padding:0 0 1rem;border-bottom:1px solid rgba(255,255,255,0.125);user-select:no-select;cursor:initial;display:grid;grid-template-rows:0fr;transition:grid-template-rows 500ms;}
            .collapsible:hover{grid-template-rows:1fr;}
              .collapsible>.content{overflow:hidden;min-height:45px;}
              .collapsible.title{margin:0}
            </style>
            ${setCollapsibles(
              addBlankToLinkTag(setCheckboxes(md.render(markdown)))
            )}`;
            }
          }
        );
      }

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
