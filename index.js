#!/usr/bin/env node
const axios = require('axios');
const cheerio = require('cheerio');
const { program } = require('commander');
const { Scheduler } = require('./scheduler');

const TOTAL_COUNT = 100; // 爬取总次数

let scheduler = undefined; // 调度器

// 获取网站标题，并打印序号
const getTitle = (index, $) => {
  console.log(`${index} 网站标题:`, $('title').text());
};

const runSpider = (concurrency, url) => {
  // 初始化调度器
  scheduler = new Scheduler(concurrency);
  // 添加任务
  for (let i = 0; i < TOTAL_COUNT; i++) {
    scheduler.add(() => {
      return axios.get(url).then(res => {
        getTitle(i, cheerio.load(res.data));
      });
    });
  }
};

program
  .requiredOption('-c, --concurrent <Number>') // 并发数
  .arguments('<url>') // 爬取的网站
  .action((url, option) => {
    runSpider(Number(option.concurrent), url); // 开始爬取
  });

program.parse(process.argv);
