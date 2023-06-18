# news_aggregator
News aggregator project for evaluation by Lumi News
This project aggregates news articles from various websites and stores it for users to see and review.
This project is a purely backend project. 

## Build stack
Built on NodeJs, Express & MongoDb

## Deployment
1. Replace values the `.env` file with the required secrets. 
2. Install nodeJs
3. run `npm run deploy-prod`

## API documentation
Please refer to the postman collection in `news_aggregator.postman_collection`

## Authentication
1. login by requesting `GET /auth/login`. Server will respond with a token.
2. This token should be attached to the header of all subsequent requests as `token` header.

## Trigger scraping
To manually trigger scraping - run `node scrap.cron.js`; 
Scaper will pull all data from rss feeds but will only scrape websites for articles from the last `X` days
Period can be specified in the `.env` file using the `PAST_DAYS` key

## Future
1. I may add a frontend to pull the data and review data.
2. Clean up image saving - use streams instead of saving locally