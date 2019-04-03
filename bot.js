console.log("bot is starting");

const Twit = require("twit");
const axios = require("axios");
const config = require("./config");

// Edit config file to work...
const T = new Twit(config);

function tweetQuotes() {
  //the random quotes URL
  const end_point =
    "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1";

  //Fetching quotes
  axios
    .get(end_point)
    .then(res => {
      str = res.data[0].content;
      let content = str
        .replace(/<\/?[^>]+>/gi, "") //replacing <p> tag with ""
        .replace(/&#8217;/g, "'") //replacing &#8217; with '
        .replace(/&#8212;/g, "-")
        .replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"')
        .replace(/&.*?;/g, "");

      let title = res.data[0].title.replace(/&.*?;/g, ""); //replacing any regex with empty string
      let link = res.data[0].link.replace(/&.*?;/g, "");

      // the status or tweet
      let status =
        "#DailyQuotes #RandomQuotes" +
        " " +
        content +
        " by:" +
        title +
        " " +
        link;

      //Tweeting
      T.post("statuses/update", { status }, (err, data, response) =>
        console.log(data.text)
      );
    })
    .catch(err => console.log(err));
}

// calling tweetQuotes every 24 hrs
setInterval(tweetQuotes, 1000 * 60 * 60 * 24);
