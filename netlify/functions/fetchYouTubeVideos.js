exports.handler = async function (event, context) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = "UC3QyfBBfWv9NtrdF6azTGEQ";
  const MAX_RESULTS = 10;

  try {
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}`
    );
    const searchData = await searchResponse.json();

    const videoDetailsPromises = searchData.items
      .filter((item) => item.id.kind === "youtube#video")
      .map(async (item) => {
        const videoId = item.id.videoId;
        const videoStatsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${API_KEY}`
        );
        const videoStatsData = await videoStatsResponse.json();
        const video = videoStatsData.items[0];
        return {
          id: videoId,
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails.high.url,
          views: parseInt(video.statistics.viewCount),
        };
      });

    const videos = await Promise.all(videoDetailsPromises);

    videos.sort((a, b) => b.views - a.views);

    return {
      statusCode: 200,
      body: JSON.stringify(videos.slice(0, 3)),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server Error" }),
    };
  }
};
