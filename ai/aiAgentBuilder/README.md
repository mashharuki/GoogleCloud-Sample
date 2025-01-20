# Google Cloud AI Agent Buidler

## AI Agent Builder とは

ノーコードで AI Agent を作成できるキット

## API としてのインテグレーションの方法

1. コンソールから AI エージェントを作成
2. プレビューでの検証
3. curl でテスト
4. API として仕込む

## マルチ AI Agent の組み方

それぞれに Goal と instractions を与える。

以下のように他の AI Agent とやりとりするように設定できる。

```txt
- Greet the user and tell them that you can help answer question s related baseball.
- DO NOT attempt to answer the user's question ever.
- ALWAYS transfer them directly to another topic.
- There is a topic you can choose from:
    - For questions related to maths transfert to ${PLAYBOOK:baseball expert}
```

やりとりできる！！

## サンプル AI Agent の作り方

1. Agent Builder の画面でアプリを作成を押す。

2. `Dialogflow API`の API を有効化する。

3. 以下の目標を入力する。

   ```txt
   You are a shirt store ordering agent. Help customers purchase shirts.
   Help the customer choose a size and color.
   The shirts come in small, medium, and large.
   The shirts can be red, green, or blue.
   ```

4. 以下の指示を入力する。

   ```txt

   ```

## 試しに Coingekko と連動させた AI Agent の例

```bash
curl -X POST -H "Authorization: Bearer $(gcloud auth print-access-token)" \
-H "Content-Type: application/json" \
"https://discoveryengine.googleapis.com/v1alpha/projects/429380797965/locations/global/collections/default_collection/engines/sample-project_1737372018044/servingConfigs/default_search:search" \
-d '{"query":"What is trend of web3??","pageSize":10,"queryExpansionSpec":{"condition":"AUTO"},"spellCorrectionSpec":{"mode":"AUTO"}}'
```

出力結果

```json
{
  "results": [
    {
      "id": "0",
      "document": {
        "name": "projects/429380797965/locations/global/collections/default_collection/dataStores/coingekko_1737372092506/branches/0/documents/0",
        "id": "0",
        "derivedStructData": {
          "htmlTitle": "\u003cb\u003eWeb3\u003c/b\u003e Gaming Analytics for Investors | CoinGecko",
          "displayLink": "www.coingecko.com",
          "pagemap": {
            "cse_image": [
              {
                "src": "https://assets.coingecko.com/posts/images/1044/large/Gaming_Analytics_for_Investors.png?1692083423"
              }
            ],
            "metatags": [
              {
                "og:title": "Web3 Gaming Analytics for Investors | CoinGecko",
                "og:description": "Learn about considerations for investors when investing in web3 games.",
                "twitter:title": "Web3 Gaming Analytics for Investors | CoinGecko",
                "twitter:site": "@coingecko",
                "application-name": "CoinGecko",
                "og:site_name": "CoinGecko",
                "viewport": "width=device-width, initial-scale=1.0",
                "twitter:image": "https://assets.coingecko.com/posts/images/1044/large/Gaming_Analytics_for_Investors.png?1692083423",
                "twitter:description": "Learn about considerations for investors when investing in web3 games.",
                "og:url": "https://www.coingecko.com/learn/web3-gaming-analytics-for-investors",
                "action-cable-url": "wss://cables.coingecko.com/cable",
                "og:image": "https://assets.coingecko.com/posts/images/1044/large/Gaming_Analytics_for_Investors.png?1692083423",
                "twitter:creator": "@coingecko",
                "twitter:card": "summary_large_image",
                "og:type": "website"
              }
            ],
            "cse_thumbnail": [
              {
                "height": "159",
                "width": "318",
                "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi5JWilV1ZEpWWLiJL453LDCo-Tb-Rq4YzANmmKOo7cyeGWUINDcPvNl2H&s"
              }
            ]
          },
          "title": "Web3 Gaming Analytics for Investors | CoinGecko",
          "htmlFormattedUrl": "https://www.coingecko.com/learn/\u003cb\u003eweb3\u003c/b\u003e-gaming-analytics-for-investors",
          "snippets": [
            {
              "snippet": "Apr 22, 2024 ... Market movements are also important, such as tracking smart money and monitoring public sentiment around the game. Web3 Gaming Analytics for ...",
              "htmlSnippet": "Apr 22, 2024 \u003cb\u003e...\u003c/b\u003e Market movements are also important, such as tracking smart money and monitoring public sentiment around the game. \u003cb\u003eWeb3\u003c/b\u003e Gaming Analytics for&nbsp;..."
            }
          ],
          "formattedUrl": "https://www.coingecko.com/learn/web3-gaming-analytics-for-investors",
          "link": "https://www.coingecko.com/learn/web3-gaming-analytics-for-investors"
        }
      }
    },
    {
      "id": "1",
      "document": {
        "name": "projects/429380797965/locations/global/collections/default_collection/dataStores/coingekko_1737372092506/branches/0/documents/1",
        "id": "1",
        "derivedStructData": {
          "displayLink": "www.coingecko.com",
          "formattedUrl": "https://www.coingecko.com/en/coins/web3-ton-token",
          "htmlTitle": "\u003cb\u003eWeb3\u003c/b\u003e TON Token Price: \u003cb\u003eWEB3\u003c/b\u003e Live Price Chart, Market Cap ...",
          "link": "https://www.coingecko.com/en/coins/web3-ton-token",
          "title": "Web3 TON Token Price: WEB3 Live Price Chart, Market Cap ...",
          "snippets": [
            {
              "snippet": "The price of Web3 TON Token (WEB3) is calculated in real-time by aggregating the latest data across 2 exchanges and 4 markets, using a global volume-weighted ...",
              "htmlSnippet": "The price of \u003cb\u003eWeb3\u003c/b\u003e TON Token (\u003cb\u003eWEB3\u003c/b\u003e) is calculated in real-time by aggregating the latest data across 2 exchanges and 4 markets, using a global volume-weighted&nbsp;..."
            }
          ],
          "pagemap": {
            "metatags": [
              {
                "viewport": "width=device-width, initial-scale=1.0",
                "twitter:creator": "@coingecko",
                "twitter:image": "https://static.coingecko.com/s/social_image_cards/social_image_card_standard-ac72fc0532e65a63616ea57562392567892acf5998330b8bce42b41e356af961.png",
                "og:url": "https://www.coingecko.com/en/coins/web3-ton-token",
                "twitter:card": "summary_large_image",
                "action-cable-url": "wss://cables.coingecko.com/cable",
                "og:site_name": "CoinGecko",
                "twitter:description": "Track the latest Web3 TON Token price, market cap, trading volume, news and more with CoinGecko's live WEB3 price chart and popular cryptocurrency price tracker.",
                "og:title": "Web3 TON Token Price: WEB3 Live Price Chart, Market Cap & News Today | CoinGecko",
                "og:image": "https://static.coingecko.com/s/social_image_cards/social_image_card_standard-ac72fc0532e65a63616ea57562392567892acf5998330b8bce42b41e356af961.png",
                "og:type": "website",
                "twitter:title": "Web3 TON Token Price: WEB3 Live Price Chart, Market Cap & News Today | CoinGecko",
                "twitter:site": "@coingecko",
                "og:description": "Track the latest Web3 TON Token price, market cap, trading volume, news and more with CoinGecko's live WEB3 price chart and popular cryptocurrency price tracker.",
                "application-name": "CoinGecko"
              }
            ],
            "cse_image": [
              {
                "src": "https://static.coingecko.com/s/social_image_cards/social_image_card_standard-ac72fc0532e65a63616ea57562392567892acf5998330b8bce42b41e356af961.png"
              }
            ],
            "table": [
              {
                "about": "WEB3 Historical Price"
              }
            ],
            "cse_thumbnail": [
              {
                "height": "163",
                "width": "310",
                "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd_3FinSRxMBUiEI1GVrp5uOkZf6VkEXxCpjfv8fzmTl0uVEN5uM3yRIk&s"
              }
            ]
          },
          "htmlFormattedUrl": "https://www.coingecko.com/en/coins/\u003cb\u003eweb3\u003c/b\u003e-ton-token"
        }
      }
    },
    {
      "id": "2",
      "document": {
        "name": "projects/429380797965/locations/global/collections/default_collection/dataStores/coingekko_1737372092506/branches/0/documents/2",
        "id": "2",
        "derivedStructData": {
          "snippets": [
            {
              "snippet": "The price of Web3 Forensics (W3F) is calculated in real-time by aggregating the latest data across 1 exchanges and 1 markets, using a global volume-weighted ...",
              "htmlSnippet": "The price of \u003cb\u003eWeb3\u003c/b\u003e Forensics (W3F) is calculated in real-time by aggregating the latest data across 1 exchanges and 1 markets, using a global volume-weighted&nbsp;..."
            }
          ],
          "htmlFormattedUrl": "https://www.coingecko.com/en/coins/\u003cb\u003eweb3\u003c/b\u003e-forensics",
          "displayLink": "www.coingecko.com",
          "formattedUrl": "https://www.coingecko.com/en/coins/web3-forensics",
          "title": "Web3 Forensics Price: W3F Live Price Chart, Market Cap & News ...",
          "pagemap": {
            "table": [
              {
                "about": "W3F Historical Price"
              }
            ],
            "metatags": [
              {
                "twitter:description": "Track the latest Web3 Forensics price, market cap, trading volume, news and more with CoinGecko's live W3F price chart and popular cryptocurrency price tracker.",
                "application-name": "CoinGecko",
                "twitter:card": "summary_large_image",
                "action-cable-url": "wss://cables.coingecko.com/cable",
                "og:image": "https://static.coingecko.com/s/social_image_cards/social_image_card_standard-ac72fc0532e65a63616ea57562392567892acf5998330b8bce42b41e356af961.png",
                "twitter:image": "https://static.coingecko.com/s/social_image_cards/social_image_card_standard-ac72fc0532e65a63616ea57562392567892acf5998330b8bce42b41e356af961.png",
                "viewport": "width=device-width, initial-scale=1.0",
                "og:url": "https://www.coingecko.com/en/coins/web3-forensics",
                "og:description": "Track the latest Web3 Forensics price, market cap, trading volume, news and more with CoinGecko's live W3F price chart and popular cryptocurrency price tracker.",
                "twitter:creator": "@coingecko",
                "og:title": "Web3 Forensics Price: W3F Live Price Chart, Market Cap & News Today | CoinGecko",
                "og:site_name": "CoinGecko",
                "twitter:title": "Web3 Forensics Price: W3F Live Price Chart, Market Cap & News Today | CoinGecko",
                "og:type": "website",
                "twitter:site": "@coingecko"
              }
            ],
            "cse_image": [
              {
                "src": "https://static.coingecko.com/s/social_image_cards/social_image_card_standard-ac72fc0532e65a63616ea57562392567892acf5998330b8bce42b41e356af961.png"
              }
            ],
            "cse_thumbnail": [
              {
                "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd_3FinSRxMBUiEI1GVrp5uOkZf6VkEXxCpjfv8fzmTl0uVEN5uM3yRIk&s",
                "width": "310",
                "height": "163"
              }
            ]
          },
          "htmlTitle": "\u003cb\u003eWeb3\u003c/b\u003e Forensics Price: W3F Live Price Chart, Market Cap &amp; News ...",
          "link": "https://www.coingecko.com/en/coins/web3-forensics"
        }
      }
    },
    {
      "id": "3",
      "document": {
        "name": "projects/429380797965/locations/global/collections/default_collection/dataStores/coingekko_1737372092506/branches/0/documents/3",
        "id": "3",
        "derivedStructData": {
          "title": "Web3.World Price: W3W Live Price Chart, Market Cap & News ...",
          "htmlTitle": "\u003cb\u003eWeb3\u003c/b\u003e.World Price: W3W Live Price Chart, Market Cap &amp; News ...",
          "link": "https://www.coingecko.com/en/coins/web3-world",
          "snippets": [
            {
              "htmlSnippet": "The price of \u003cb\u003eWeb3\u003c/b\u003e.World (W3W) is calculated in real-time by aggregating the latest data across 1 exchanges and 1 markets, using a global volume-weighted&nbsp;...",
              "snippet": "The price of Web3.World (W3W) is calculated in real-time by aggregating the latest data across 1 exchanges and 1 markets, using a global volume-weighted ..."
            }
          ],
          "formattedUrl": "https://www.coingecko.com/en/coins/web3-world",
          "htmlFormattedUrl": "https://www.coingecko.com/en/coins/\u003cb\u003eweb3\u003c/b\u003e-world",
          "displayLink": "www.coingecko.com",
          "pagemap": {
            "metatags": [
              {
                "viewport": "width=device-width, initial-scale=1.0",
                "twitter:card": "summary_large_image",
                "og:description": "Track the latest Web3.World price, market cap, trading volume, news and more with CoinGecko's live W3W price chart and popular cryptocurrency price tracker.",
                "og:type": "website",
                "twitter:site": "@coingecko",
                "twitter:title": "Web3.World Price: W3W Live Price Chart, Market Cap & News Today | CoinGecko",
                "twitter:image": "https://static.coingecko.com/s/social_image_cards/social_image_card_standard-ac72fc0532e65a63616ea57562392567892acf5998330b8bce42b41e356af961.png",
                "og:image": "https://static.coingecko.com/s/social_image_cards/social_image_card_standard-ac72fc0532e65a63616ea57562392567892acf5998330b8bce42b41e356af961.png",
                "og:title": "Web3.World Price: W3W Live Price Chart, Market Cap & News Today | CoinGecko",
                "og:site_name": "CoinGecko",
                "og:url": "https://www.coingecko.com/en/coins/web3-world",
                "application-name": "CoinGecko",
                "twitter:creator": "@coingecko",
                "twitter:description": "Track the latest Web3.World price, market cap, trading volume, news and more with CoinGecko's live W3W price chart and popular cryptocurrency price tracker.",
                "action-cable-url": "wss://cables.coingecko.com/cable"
              }
            ],
            "table": [
              {
                "about": "W3W Historical Price"
              }
            ],
            "cse_image": [
              {
                "src": "https://static.coingecko.com/s/social_image_cards/social_image_card_standard-ac72fc0532e65a63616ea57562392567892acf5998330b8bce42b41e356af961.png"
              }
            ],
            "cse_thumbnail": [
              {
                "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd_3FinSRxMBUiEI1GVrp5uOkZf6VkEXxCpjfv8fzmTl0uVEN5uM3yRIk&s",
                "width": "310",
                "height": "163"
              }
            ]
          }
        }
      }
    },
    {
      "id": "4",
      "document": {
        "name": "projects/429380797965/locations/global/collections/default_collection/dataStores/coingekko_1737372092506/branches/0/documents/4",
        "id": "4",
        "derivedStructData": {
          "snippets": [
            {
              "htmlSnippet": "7-day price history of \u003cb\u003eWeb3\u003c/b\u003e TON Token (\u003cb\u003eWEB3\u003c/b\u003e) to JPY &middot; Related Coins in JPY &middot; \u003cb\u003eTrending\u003c/b\u003e Coins in JPY &middot; CoinGecko Cryptocurrency Data API.",
              "snippet": "7-day price history of Web3 TON Token (WEB3) to JPY · Related Coins in JPY · Trending Coins in JPY · CoinGecko Cryptocurrency Data API."
            }
          ],
          "title": "WEB3 to JPY: Web3 TON Token Price in Japanese Yen | CoinGecko",
          "displayLink": "www.coingecko.com",
          "formattedUrl": "https://www.coingecko.com/en/coins/web3-ton-token/jpy",
          "htmlTitle": "\u003cb\u003eWEB3\u003c/b\u003e to JPY: \u003cb\u003eWeb3\u003c/b\u003e TON Token Price in Japanese Yen | CoinGecko",
          "htmlFormattedUrl": "https://www.coingecko.com/en/coins/\u003cb\u003eweb3\u003c/b\u003e-ton-token/jpy",
          "link": "https://www.coingecko.com/en/coins/web3-ton-token/jpy",
          "pagemap": {
            "cse_image": [
              {
                "src": "https://assets.coingecko.com/coins/images/37099/large/logo-web3.png?1713288850"
              }
            ],
            "metatags": [
              {
                "action-cable-url": "wss://cables.coingecko.com/cable",
                "og:type": "website",
                "twitter:title": "WEB3 to JPY: Web3 TON Token Price in Japanese Yen | CoinGecko",
                "og:image": "https://assets.coingecko.com/coins/images/37099/large/logo-web3.png?1713288850",
                "twitter:image": "https://assets.coingecko.com/coins/images/37099/large/logo-web3.png?1713288850",
                "og:url": "https://www.coingecko.com/en/coins/web3-ton-token/jpy",
                "og:description": "Get live charts for WEB3 to JPY. Convert Web3 TON Token (WEB3) to Japanese Yen (JPY).",
                "og:title": "WEB3 to JPY: Web3 TON Token Price in Japanese Yen | CoinGecko",
                "twitter:creator": "@coingecko",
                "twitter:description": "Get live charts for WEB3 to JPY. Convert Web3 TON Token (WEB3) to Japanese Yen (JPY).",
                "viewport": "width=device-width, initial-scale=1.0",
                "application-name": "CoinGecko",
                "og:site_name": "CoinGecko",
                "twitter:site": "@coingecko",
                "twitter:card": "summary_large_image"
              }
            ],
            "cse_thumbnail": [
              {
                "width": "225",
                "height": "225",
                "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiDOYxkh34cOdzcHNSfWyHCPXyD_ctkobSOL8dhC7qgwcU394W88YAjs8&s"
              }
            ]
          }
        }
      }
    },
    {
      "id": "5",
      "document": {
        "name": "projects/429380797965/locations/global/collections/default_collection/dataStores/coingekko_1737372092506/branches/0/documents/5",
        "id": "5",
        "derivedStructData": {
          "pagemap": {
            "cse_image": [
              {
                "src": "https://assets.coingecko.com/coins/images/39289/large/w3f_logo_transparent.png?1721589567"
              }
            ],
            "metatags": [
              {
                "og:site_name": "CoinGecko",
                "twitter:creator": "@coingecko",
                "action-cable-url": "wss://cables.coingecko.com/cable",
                "og:title": "W3F to USD: Web3 Forensics Price in US Dollar | CoinGecko",
                "og:type": "website",
                "twitter:description": "Get live charts for W3F to USD. Convert Web3 Forensics (W3F) to US Dollar (USD).",
                "viewport": "width=device-width, initial-scale=1.0",
                "og:description": "Get live charts for W3F to USD. Convert Web3 Forensics (W3F) to US Dollar (USD).",
                "og:image": "https://assets.coingecko.com/coins/images/39289/large/w3f_logo_transparent.png?1721589567",
                "twitter:site": "@coingecko",
                "twitter:title": "W3F to USD: Web3 Forensics Price in US Dollar | CoinGecko",
                "twitter:image": "https://assets.coingecko.com/coins/images/39289/large/w3f_logo_transparent.png?1721589567",
                "twitter:card": "summary_large_image",
                "application-name": "CoinGecko",
                "og:url": "https://www.coingecko.com/en/coins/web3-forensics/usd"
              }
            ],
            "cse_thumbnail": [
              {
                "width": "225",
                "height": "225",
                "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZW6_BMJd8rm5HZHdlF5R9uAtvsTRxKLPMqO_C4X28aK4Y2RobSIML3Pw&s"
              }
            ]
          },
          "htmlFormattedUrl": "https://www.coingecko.com/en/coins/\u003cb\u003eweb3\u003c/b\u003e-forensics/usd",
          "htmlTitle": "W3F to USD: \u003cb\u003eWeb3\u003c/b\u003e Forensics Price in US Dollar | CoinGecko",
          "snippets": [
            {
              "snippet": "Should there be any price movements in the future, the chart will be readjusted to reflect those changes. ... What is the price trend of Web3 Forensics in USD?",
              "htmlSnippet": "Should there be any price movements in the future, the chart will be readjusted to reflect those changes. ... What is the price \u003cb\u003etrend of Web3\u003c/b\u003e Forensics in USD?"
            }
          ],
          "formattedUrl": "https://www.coingecko.com/en/coins/web3-forensics/usd",
          "displayLink": "www.coingecko.com",
          "title": "W3F to USD: Web3 Forensics Price in US Dollar | CoinGecko",
          "link": "https://www.coingecko.com/en/coins/web3-forensics/usd"
        }
      }
    },
    {
      "id": "6",
      "document": {
        "name": "projects/429380797965/locations/global/collections/default_collection/dataStores/coingekko_1737372092506/branches/0/documents/6",
        "id": "6",
        "derivedStructData": {
          "link": "https://www.coingecko.com/en/coins/web3-ton-token/cny",
          "htmlFormattedUrl": "https://www.coingecko.com/en/coins/\u003cb\u003eweb3\u003c/b\u003e-ton-token/cny",
          "title": "WEB3 to CNY: Web3 TON Token Price in Chinese Yuan | CoinGecko",
          "snippets": [
            {
              "snippet": "7-day price history of Web3 TON Token (WEB3) to CNY · Related Coins in CNY · Trending Coins in CNY · CoinGecko Cryptocurrency Data API.",
              "htmlSnippet": "7-day price history of \u003cb\u003eWeb3\u003c/b\u003e TON Token (\u003cb\u003eWEB3\u003c/b\u003e) to CNY &middot; Related Coins in CNY &middot; \u003cb\u003eTrending\u003c/b\u003e Coins in CNY &middot; CoinGecko Cryptocurrency Data API."
            }
          ],
          "htmlTitle": "\u003cb\u003eWEB3\u003c/b\u003e to CNY: \u003cb\u003eWeb3\u003c/b\u003e TON Token Price in Chinese Yuan | CoinGecko",
          "formattedUrl": "https://www.coingecko.com/en/coins/web3-ton-token/cny",
          "displayLink": "www.coingecko.com",
          "pagemap": {
            "cse_image": [
              {
                "src": "https://assets.coingecko.com/coins/images/37099/large/logo-web3.png?1713288850"
              }
            ],
            "metatags": [
              {
                "og:title": "WEB3 to CNY: Web3 TON Token Price in Chinese Yuan | CoinGecko",
                "og:type": "website",
                "twitter:description": "Get live charts for WEB3 to CNY. Convert Web3 TON Token (WEB3) to Chinese Yuan (CNY).",
                "og:image": "https://assets.coingecko.com/coins/images/37099/large/logo-web3.png?1713288850",
                "twitter:site": "@coingecko",
                "twitter:creator": "@coingecko",
                "og:url": "https://www.coingecko.com/en/coins/web3-ton-token/cny",
                "og:description": "Get live charts for WEB3 to CNY. Convert Web3 TON Token (WEB3) to Chinese Yuan (CNY).",
                "action-cable-url": "wss://cables.coingecko.com/cable",
                "twitter:image": "https://assets.coingecko.com/coins/images/37099/large/logo-web3.png?1713288850",
                "viewport": "width=device-width, initial-scale=1.0",
                "application-name": "CoinGecko",
                "twitter:title": "WEB3 to CNY: Web3 TON Token Price in Chinese Yuan | CoinGecko",
                "twitter:card": "summary_large_image",
                "og:site_name": "CoinGecko"
              }
            ],
            "cse_thumbnail": [
              {
                "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiDOYxkh34cOdzcHNSfWyHCPXyD_ctkobSOL8dhC7qgwcU394W88YAjs8&s",
                "height": "225",
                "width": "225"
              }
            ]
          }
        }
      }
    },
    {
      "id": "7",
      "document": {
        "name": "projects/429380797965/locations/global/collections/default_collection/dataStores/coingekko_1737372092506/branches/0/documents/7",
        "id": "7",
        "derivedStructData": {
          "pagemap": {
            "cse_thumbnail": [
              {
                "height": "159",
                "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFIyqgsBHgDu_gLoB6tJ_5bkNvvXyc0drafDxSL-8A1LCx9i6YP3kmunY&s",
                "width": "318"
              }
            ],
            "cse_image": [
              {
                "src": "https://assets.coingecko.com/posts/images/928/large/Web3-Gaming-Countries-thumbnail.png?1684137696"
              }
            ],
            "metatags": [
              {
                "twitter:image": "https://assets.coingecko.com/posts/images/928/large/Web3-Gaming-Countries-thumbnail.png?1684137696",
                "twitter:title": "Web3 Gaming Countries 2021-2023 | CoinGecko",
                "og:site_name": "CoinGecko",
                "application-name": "CoinGecko",
                "twitter:card": "summary_large_image",
                "viewport": "width=device-width, initial-scale=1.0",
                "twitter:creator": "@coingecko",
                "og:url": "https://www.coingecko.com/research/publications/web3-gaming-interest-countries",
                "twitter:description": "Find out which 9 countries have consistently made the top web3 gaming country rankings for 3 years, and which regions have the highest interest.",
                "twitter:site": "@coingecko",
                "action-cable-url": "wss://cables.coingecko.com/cable",
                "og:title": "Web3 Gaming Countries 2021-2023 | CoinGecko",
                "og:type": "website",
                "og:description": "Find out which 9 countries have consistently made the top web3 gaming country rankings for 3 years, and which regions have the highest interest.",
                "og:image": "https://assets.coingecko.com/posts/images/928/large/Web3-Gaming-Countries-thumbnail.png?1684137696"
              }
            ]
          },
          "link": "https://www.coingecko.com/research/publications/web3-gaming-interest-countries",
          "formattedUrl": "https://www.coingecko.com/research/.../web3-gaming-interest-countries",
          "displayLink": "www.coingecko.com",
          "snippets": [
            {
              "htmlSnippet": "May 15, 2023 \u003cb\u003e...\u003c/b\u003e The Southeast Asia region has been a key market for GameFi, with Southeast Asian countries dominating the global top 15 rankings in past years.",
              "snippet": "May 15, 2023 ... The Southeast Asia region has been a key market for GameFi, with Southeast Asian countries dominating the global top 15 rankings in past years."
            }
          ],
          "htmlFormattedUrl": "https://www.coingecko.com/research/.../\u003cb\u003eweb3\u003c/b\u003e-gaming-interest-countries",
          "title": "Web3 Gaming Countries 2021-2023 | CoinGecko",
          "htmlTitle": "\u003cb\u003eWeb3\u003c/b\u003e Gaming Countries 2021-2023 | CoinGecko"
        }
      }
    },
    {
      "id": "8",
      "document": {
        "name": "projects/429380797965/locations/global/collections/default_collection/dataStores/coingekko_1737372092506/branches/0/documents/8",
        "id": "8",
        "derivedStructData": {
          "title": "W3F to ARS: Web3 Forensics Price in Argentine Peso | CoinGecko",
          "snippets": [
            {
              "snippet": "Should there be any price movements in the future, the chart will be readjusted to reflect those changes. ... What is the price trend of Web3 Forensics in ARS?",
              "htmlSnippet": "Should there be any price movements in the future, the chart will be readjusted to reflect those changes. ... What is the price \u003cb\u003etrend of Web3\u003c/b\u003e Forensics in ARS?"
            }
          ],
          "displayLink": "www.coingecko.com",
          "htmlFormattedUrl": "https://www.coingecko.com/en/coins/\u003cb\u003eweb3\u003c/b\u003e-forensics/ars",
          "htmlTitle": "W3F to ARS: \u003cb\u003eWeb3\u003c/b\u003e Forensics Price in Argentine Peso | CoinGecko",
          "pagemap": {
            "cse_image": [
              {
                "src": "https://static.coingecko.com/s/social_image_cards/social_image_card_standard-ac72fc0532e65a63616ea57562392567892acf5998330b8bce42b41e356af961.png"
              }
            ],
            "cse_thumbnail": [
              {
                "height": "79",
                "width": "150",
                "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjDHocL2yw4F_2EVFx719s6YDgS64Wk5crUFskxW2MWycI19xuJjNcHw&s=0"
              }
            ],
            "metatags": [
              {
                "og:type": "website",
                "twitter:creator": "@coingecko",
                "twitter:site": "@coingecko",
                "viewport": "width=device-width, initial-scale=1.0",
                "action-cable-url": "wss://cables.coingecko.com/cable",
                "twitter:card": "summary_large_image",
                "application-name": "CoinGecko",
                "twitter:title": "W3F to ARS: Web3 Forensics Price in Argentine Peso | CoinGecko",
                "og:url": "https://www.coingecko.com/en/coins/web3-forensics/ars",
                "og:description": "Get live charts for W3F to ARS. Convert Web3 Forensics (W3F) to Argentine Peso (ARS).",
                "twitter:description": "Get live charts for W3F to ARS. Convert Web3 Forensics (W3F) to Argentine Peso (ARS).",
                "twitter:image": "https://static.coingecko.com/s/social_image_cards/social_image_card_standard-ac72fc0532e65a63616ea57562392567892acf5998330b8bce42b41e356af961.png",
                "og:title": "W3F to ARS: Web3 Forensics Price in Argentine Peso | CoinGecko",
                "og:image": "https://static.coingecko.com/s/social_image_cards/social_image_card_standard-ac72fc0532e65a63616ea57562392567892acf5998330b8bce42b41e356af961.png",
                "og:site_name": "CoinGecko"
              }
            ]
          },
          "formattedUrl": "https://www.coingecko.com/en/coins/web3-forensics/ars",
          "link": "https://www.coingecko.com/en/coins/web3-forensics/ars"
        }
      }
    },
    {
      "id": "9",
      "document": {
        "name": "projects/429380797965/locations/global/collections/default_collection/dataStores/coingekko_1737372092506/branches/0/documents/9",
        "id": "9",
        "derivedStructData": {
          "link": "https://www.coingecko.com/en/coins/web3-ton-token/eur",
          "pagemap": {
            "cse_image": [
              {
                "src": "https://static.coingecko.com/s/social_image_cards/social_image_card_standard-ac72fc0532e65a63616ea57562392567892acf5998330b8bce42b41e356af961.png"
              }
            ],
            "cse_thumbnail": [
              {
                "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd_3FinSRxMBUiEI1GVrp5uOkZf6VkEXxCpjfv8fzmTl0uVEN5uM3yRIk&s",
                "height": "163",
                "width": "310"
              }
            ],
            "metatags": [
              {
                "og:image": "https://static.coingecko.com/s/social_image_cards/social_image_card_standard-ac72fc0532e65a63616ea57562392567892acf5998330b8bce42b41e356af961.png",
                "og:url": "https://www.coingecko.com/en/coins/web3-ton-token/eur",
                "twitter:site": "@coingecko",
                "og:type": "website",
                "og:title": "WEB3 to EUR: Web3 TON Token Price in Euro | CoinGecko",
                "application-name": "CoinGecko",
                "twitter:creator": "@coingecko",
                "twitter:card": "summary_large_image",
                "og:site_name": "CoinGecko",
                "og:description": "Get live charts for WEB3 to EUR. Convert Web3 TON Token (WEB3) to Euro (EUR).",
                "twitter:description": "Get live charts for WEB3 to EUR. Convert Web3 TON Token (WEB3) to Euro (EUR).",
                "action-cable-url": "wss://cables.coingecko.com/cable",
                "twitter:title": "WEB3 to EUR: Web3 TON Token Price in Euro | CoinGecko",
                "viewport": "width=device-width, initial-scale=1.0",
                "twitter:image": "https://static.coingecko.com/s/social_image_cards/social_image_card_standard-ac72fc0532e65a63616ea57562392567892acf5998330b8bce42b41e356af961.png"
              }
            ]
          },
          "title": "WEB3 to EUR: Web3 TON Token Price in Euro | CoinGecko",
          "htmlFormattedUrl": "https://www.coingecko.com/en/coins/\u003cb\u003eweb3\u003c/b\u003e-ton-token/eur",
          "formattedUrl": "https://www.coingecko.com/en/coins/web3-ton-token/eur",
          "displayLink": "www.coingecko.com",
          "htmlTitle": "\u003cb\u003eWEB3\u003c/b\u003e to EUR: \u003cb\u003eWeb3\u003c/b\u003e TON Token Price in Euro | CoinGecko",
          "snippets": [
            {
              "htmlSnippet": "7-day price history of \u003cb\u003eWeb3\u003c/b\u003e TON Token (\u003cb\u003eWEB3\u003c/b\u003e) to EUR &middot; Related Coins in EUR &middot; \u003cb\u003eTrending\u003c/b\u003e Coins in EUR &middot; CoinGecko Cryptocurrency Data API.",
              "snippet": "7-day price history of Web3 TON Token (WEB3) to EUR · Related Coins in EUR · Trending Coins in EUR · CoinGecko Cryptocurrency Data API."
            }
          ]
        }
      }
    }
  ],
  "totalSize": 6640,
  "attributionToken": "zQHwzAoLCMCFubwGEJqBgT8SJDY3OGRjOGFlLTAwMDAtMmQ1NC1hNzdkLWM4MmFkZDZiY2IyNCIHR0VORVJJQyqMAZWSxTCRv9owzua1L8bL8xet-LMtnNa3LduPmiKjibMtjr6dFZCktDDkq-swx8axMMT8yzDm3cQwzJ3bMJ_Wty2NpLQwqvizLdHmtS-gibMt1LKdFd6PmiKrxIotlL_aMOGr6zCQ97IwjpHJMMH8yzCuxIoto4CXIsTGsTDp3cQwwvCeFcmd2zC3t4wtMAE",
  "nextPageToken": "QjMiNmY2QGZhJDOj1CZ3cTYtQTNkJTLwADMw0CZhhzYkhzN2QiGCob7X3PEGwLyuDMCMIBMxIgC",
  "guidedSearchResult": {},
  "summary": {}
}
```

### 参考文献

1. [Youtube - 5 分でわかる！Vertex AI Agent Builder でアプリの開発](https://www.youtube.com/watch?v=aIc4maOHodQ)
2. [AI Agent Builder Docs](https://cloud.google.com/products/agent-builder?hl=ja)
3. [AI Agent Buidler クイックスタート](https://cloud.google.com/dialogflow/vertex/docs/quick/create-application?hl=ja)
4. [Vertex AI Agent Builder を試してみた](https://qiita.com/mrsd/items/5bb4f826eccabea7d643)
5. [Vertex AI Agents を使ってみた](https://blog.g-gen.co.jp/entry/trial-for-vertex-ai-agent-builder)
6. [Dialogflow の設定とクリーンアップ](https://cloud.google.com/dialogflow/cx/docs/quick/setup?hl=ja)
7. [AI Agent Builder コンソール画面](https://console.cloud.google.com/gen-app-builder/engines)
