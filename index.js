#!/usr/bin/env node
const axios = require('axios');
const cheerio = require('cheerio');
const { program } = require('commander');
const { Scheduler } = require('./scheduler');

const TOTAL_COUNT = 100;

let scheduler = undefined;

const fetchData = async url => {
  try {
    const res = await axios.get(url);
    return cheerio.load(res.data);
  } catch (error) {
    console.error(`Error in fetching data from ${url}`);
    return null;
  }
};

const getTitle = (index, $) => {
  console.log(`${index} 网站标题:`, $('title').text());
};

const runSpider = async (concurrency, url) => {
  scheduler = new Scheduler(concurrency);
  for (let i = 0; i < TOTAL_COUNT; i++) {
    scheduler.add(async () => {
      const $ = await fetchData(url);
      $ && getTitle(i, $);
    });
  }
};

program
  .requiredOption('-c, --concurrent <Number>')
  .arguments('<url>')
  .action((url, option) => {
    runSpider(Number(option.concurrent), url);
  });

program.parse(process.argv);
