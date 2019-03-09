import getGuide from "./getGuide";
import getChannels from "./getChannels";

async function getFullGuide() {
  const [guide, channels] = await Promise.all([getGuide(), getChannels()]);
}

export default getFullGuide;
