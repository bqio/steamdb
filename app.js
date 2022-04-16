async function fetchApps() {
  const response = await fetch("steamdb.json");
  const json = await response.json();
  return json.applist.apps;
}

const fuseOpts = {
  keys: ["name"],
  threshold: 0.2,
  ignoreLocation: true,
};

Vue.createApp({
  data() {
    return {
      apps: [],
      _apps: [],
      maxApps: 40,
      maxPages: 5,
      page: 0,
      isLoaded: false,
      inputTimer: null,
      fuse: null,
      searchStr: "",
    };
  },
  methods: {
    searchHandler(evt) {
      clearTimeout(this.inputTimer);
      this.inputTimer = setTimeout(() => {
        this.isLoaded = false;
        this.search(evt.target.value);
      }, 1000);
    },
    search(query) {
      this.page = 0;
      const result = this.fuse.search(query);
      this.apps = result.map((el) => el.item);
      this.isLoaded = true;
      this.searchStr = "";
    },
    getAppImage(appid) {
      return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/capsule_616x353.jpg`;
    },
    openApp(appid) {
      window.open(`https://store.steampowered.com/app/${appid}`, "_blank");
    },
    setPage(page) {
      this.page = page;
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    setPlaceholder(evt) {
      evt.target.src = "placeholder.png";
    },
  },
  computed: {
    view() {
      return this.apps.slice(
        this.page * this.maxApps,
        this.page * this.maxApps + this.maxApps
      );
    },
    pagesCount() {
      return Math.round(this.apps.length / this.maxApps);
    },
    pagesArr() {
      arr = [];
      for (let i = 0; i < this.pagesCount; i++) {
        arr.push(i);
      }
      return arr;
    },
    pagesArrView() {
      let start = this.page - this.maxPages;
      let end = this.page + this.maxPages;
      if (start < 0) {
        start = 0;
      }
      return this.pagesArr.slice(start, end);
    },
  },
  async mounted() {
    const apps = await fetchApps();
    this._apps = apps;
    this.fuse = new Fuse(this._apps, fuseOpts);
    this.apps = apps;
    this.isLoaded = true;
  },
}).mount("#app");
