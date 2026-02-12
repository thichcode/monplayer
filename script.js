class MonPlayer {
  constructor() {
    this.channels = [];
    this.currentChannel = null;
    this.videoPlayer = null;
    this.loadingOverlay = null;
    this.toast = null;
    this.defaultUrl = "";

    this.initElements();
    this.bindEvents();
    this.createLoadingOverlay();
    this.createToast();
    this.initialize();
  }

  initElements() {
    this.urlInput = document.getElementById("iptvUrl");
    this.loadBtn = document.getElementById("loadBtn");
    this.channelsSection = document.getElementById("channelsSection");
    this.channelsGrid = document.getElementById("channelsGrid");
    this.channelCount = document.getElementById("channelCount");
    this.playerSection = document.getElementById("playerSection");
    this.playerTitle = document.getElementById("playerTitle");
    this.backBtn = document.getElementById("backBtn");
    this.videoPlayer = document.getElementById("videoPlayer");
    this.channelInfo = document.getElementById("channelInfo");
    this.streamUrl = document.getElementById("streamUrl");
  }

  bindEvents() {
    if (this.loadBtn) {
      this.loadBtn.addEventListener("click", () => this.loadPlaylist());
    }

    if (this.backBtn) {
      this.backBtn.addEventListener("click", () => this.showChannels());
    }

    if (this.urlInput) {
      this.urlInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.loadPlaylist();
        }
      });
    }
  }

  createLoadingOverlay() {
    this.loadingOverlay = document.createElement("div");
    this.loadingOverlay.className = "loading-overlay hidden";
    this.loadingOverlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Đang tải playlist...</div>
        `;
    document.body.appendChild(this.loadingOverlay);
  }

  createToast() {
    this.toast = document.createElement("div");
    this.toast.className = "toast";
    document.body.appendChild(this.toast);
  }

  showLoading() {
    this.loadingOverlay.classList.remove("hidden");
  }

  hideLoading() {
    this.loadingOverlay.classList.add("hidden");
  }

  showToast(message, type = "success") {
    this.toast.className = `toast ${type}`;
    this.toast.innerHTML = `
            <span class="toast-icon">${type === "success" ? "✅" : type === "error" ? "❌" : "⚠️"}</span>
            <span class="toast-message">${message}</span>
        `;
    this.toast.classList.add("show");

    setTimeout(() => {
      this.toast.classList.remove("show");
    }, 3000);
  }

  async initialize() {
    await this.loadConfigDefaults();

    const shouldAutoLoad =
      this.urlInput && this.urlInput.value && this.urlInput.value.trim();
    if (shouldAutoLoad) {
      this.loadPlaylist();
    }
  }

  async loadConfigDefaults() {
    if (!this.urlInput) return;

    try {
      const response = await fetch("/config.json");
      if (!response.ok) {
        throw new Error("Không thể đọc cấu hình mặc định");
      }

      const data = await response.json();
      this.defaultUrl = data.defaultUrl || "";

      if (this.defaultUrl && !this.urlInput.value.trim()) {
        this.urlInput.value = this.defaultUrl;
      }
    } catch (error) {
      console.warn("Không thể tải cấu hình mặc định", error);
    }
  }

  async loadPlaylist() {
    if (!this.urlInput) {
      console.error("URL input element not found");
      this.showToast(
        "Không thể tải playlist: Đầu vào URL không tồn tại",
        "error",
      );
      return;
    }

    const url = this.urlInput.value ? this.urlInput.value.trim() : "";

    if (!url) {
      this.showToast("Vui lòng nhập URL của playlist IPTV", "error");
      return;
    }

    if (!this.isValidUrl(url)) {
      this.showToast("URL không hợp lệ", "error");
      return;
    }

    this.showLoading();
    this.loadBtn.disabled = true;
    this.loadBtn.innerHTML = '<div class="loading-spinner"></div> Đang tải...';

    try {
      const proxyUrl = `/api/iptv?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (this.validateIPTVData(data)) {
        this.channels = this.processChannels(data);
        this.displayChannels();
        this.showToast(
          `Tải thành công! Đã phát hiện ${this.channels.length} kênh`,
          "success",
        );
      } else {
        throw new Error("Dữ liệu không hợp lệ với IPTV JSON Schema");
      }
    } catch (error) {
      console.error("Error loading playlist:", error);
      this.showToast(`Không thể tải playlist: ${error.message}`, "error");
    } finally {
      this.hideLoading();
      this.loadBtn.disabled = false;
      this.loadBtn.innerHTML = "Tải Playlist";
    }
  }

  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  validateIPTVData(data) {
    if (!data || typeof data !== "object") return false;

    if (data.epg && Array.isArray(data.channels)) {
      return data.channels.length > 0;
    } else if (data.list && Array.isArray(data.list)) {
      return (
        data.list.length > 0 &&
        data.list.every((channel) => channel.title && channel.url)
      );
    } else if (data.groups && Array.isArray(data.groups)) {
      return data.groups.some(
        (group) => Array.isArray(group.channels) && group.channels.length > 0,
      );
    } else if (Array.isArray(data)) {
      return data.length > 0;
    }

    return false;
  }

  processChannels(data) {
    let channels = [];

    // Provider-specific mapping: groups -> channels -> sources -> contents -> streams -> remote_data.url
    if (data.groups && Array.isArray(data.groups)) {
      data.groups.forEach((group) => {
        if (Array.isArray(group.channels)) {
          const mapped = group.channels.map((ch) => {
            let streamUrl = null;

            if (ch.sources && ch.sources.length > 0) {
              const s0 = ch.sources[0];
              if (s0.contents && s0.contents.length > 0) {
                const c0 = s0.contents[0];
                if (c0.streams && c0.streams.length > 0) {
                  const st0 = c0.streams[0];
                  if (st0.remote_data && st0.remote_data.url) {
                    streamUrl = st0.remote_data.url;
                  }
                }
              }
            }

            return {
              id: ch.id || `channel-${Math.random().toString(36).substr(2, 9)}`,
              name: ch.name || ch.title || "Kênh không tên",
              url: streamUrl || ch.url || ch.stream_url,
              logo: ch.image ? ch.image.url : ch.logo || ch.icon,
              category: ch.group || group.name || "Khác",
              description: ch.description || "",
              language: ch.language,
              country: ch.country,
            };
          });
          channels = [...channels, ...mapped];
        }
      });
    }

    // Fallbacks
    if (channels.length === 0 && data.epg && Array.isArray(data.channels)) {
      channels = data.channels.map((channel) => this.normalizeChannel(channel));
    }
    if (channels.length === 0 && data.list && Array.isArray(data.list)) {
      channels = data.list.map((channel) => this.normalizeChannel(channel));
    }
    if (channels.length === 0 && Array.isArray(data)) {
      channels = data.map((channel) => this.normalizeChannel(channel));
    }

    console.log("Parsed channels count:", channels.length);
    return channels.filter((channel) => channel.url);
  }

  normalizeChannel(channel) {
    return {
      id: channel.id || `channel-${Math.random().toString(36).substr(2, 9)}`,
      name: channel.name || channel.title || "Kênh không tên",
      url: channel.url || channel.stream_url,
      logo: channel.logo || channel.icon,
      category: channel.group || channel.category || "Khác",
      description: channel.description || "",
      language: channel.language,
      country: channel.country,
    };
  }

  extractChannelsFromGroup(group, fallbackCategory) {
    let result = [];

    if (Array.isArray(group.channels)) {
      const groupChannels = group.channels.map((channel) => ({
        ...this.normalizeChannel(channel),
        category: channel.group || fallbackCategory || "Khác",
      }));
      result = [...result, ...groupChannels];
    }

    if (group.groups && Array.isArray(group.groups)) {
      group.groups.forEach((subGroup) => {
        result = [
          ...result,
          ...this.extractChannelsFromGroup(
            subGroup,
            subGroup.name || fallbackCategory,
          ),
        ];
      });
    }

    return result;
  }

  displayChannels() {
    this.channelsGrid.innerHTML = "";

    this.channels.forEach((channel) => {
      const channelCard = this.createChannelCard(channel);
      this.channelsGrid.appendChild(channelCard);
    });

    this.channelCount.textContent = `${this.channels.length} kênh`;
    this.channelsSection.style.display = "block";
    this.playerSection.style.display = "none";

    if (this.channels.length > 0) {
      this.channelsSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  createChannelCard(channel) {
    const card = document.createElement("div");
    card.className = "channel-card";
    card.dataset.channelId = channel.id;

    card.innerHTML = `
            <div class="channel-thumbnail">
                ${
                  channel.logo
                    ? `
                    <img src="${channel.logo}" alt="${channel.name}" class="channel-logo" onerror="this.style.display='none'">
                `
                    : `
                    <div class="channel-logo" style="background: rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 2rem;">
                        📺
                    </div>
                `
                }
            </div>
            <div class="channel-info">
                <h3 class="channel-name">${this.escapeHtml(channel.name)}</h3>
                <div class="channel-category">
                    <span class="category-badge">${this.escapeHtml(channel.category)}</span>
                </div>
                <div class="channel-status">
                    <span class="status-indicator"></span>
                    <span>Hoạt động</span>
                </div>
            </div>
        `;

    card.addEventListener("click", () => this.playChannel(channel));

    return card;
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  async playChannel(channel) {
    this.currentChannel = channel;

    this.playerTitle.textContent = channel.name;
    this.streamUrl.textContent = "Đang tải stream...";

    this.channelInfo.innerHTML = `
            ${channel.description ? `<p style="margin-bottom: 0.5rem;">${this.escapeHtml(channel.description)}</p>` : ""}
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.875rem; color: var(--text-muted);">
                ${channel.language ? `<div><strong>Ngôn ngữ:</strong> ${this.escapeHtml(channel.language)}</div>` : ""}
                ${channel.country ? `<div><strong>Quốc gia:</strong> ${this.escapeHtml(channel.country)}</div>` : ""}
                <div><strong>Danh mục:</strong> ${this.escapeHtml(channel.category)}</div>
            </div>
        `;

    this.channelsSection.style.display = "none";
    this.playerSection.style.display = "block";

    try {
      const actualStreamUrl = await this.fetchActualStreamUrl(channel.url);
      this.streamUrl.textContent = actualStreamUrl;
      this.setupVideoPlayer({ ...channel, url: actualStreamUrl });
    } catch (error) {
      console.error("Error fetching stream URL:", error);
      this.showToast("Không thể tải stream", "error");
      this.streamUrl.textContent = "Lỗi: Không thể tải stream";
    }

    this.playerSection.scrollIntoView({ behavior: "smooth" });
  }

  async fetchActualStreamUrl(streamUrl) {
    try {
      const response = await fetch(
        `/api/stream?url=${encodeURIComponent(streamUrl)}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const streamLinks = Array.isArray(data.stream_links)
        ? data.stream_links
        : [];

      if (streamLinks.length === 0) {
        throw new Error("Không tìm thấy stream hợp lệ");
      }

      const defaultStream = streamLinks.find(
        (link) => link.type === "hls" && link.default === true,
      );
      if (defaultStream && defaultStream.url) {
        return defaultStream.url;
      }

      const fallbackStream = streamLinks.find(
        (link) => link.type === "hls" && link.url,
      );
      if (fallbackStream) {
        return fallbackStream.url;
      }

      throw new Error("Không tìm thấy stream HLS");
    } catch (error) {
      console.error("Error fetching stream URL:", error);
      throw error;
    }
  }

  setupVideoPlayer(channel) {
    const video = this.videoPlayer;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(channel.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS manifest parsed");
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          this.showToast("Không thể phát stream HLS", "error");
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = channel.url;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((error) => {
          this.showToast(
            "Không thể tự động phát, vui lòng nhấn nút phát",
            "warning",
          );
        });
      });
    } else {
      this.showToast("Trình duyệt không hỗ trợ định dạng stream", "error");
    }
  }

  showChannels() {
    if (this.playerSection && this.channelsSection) {
      this.playerSection.style.display = "none";
      this.channelsSection.style.display = "block";

      if (this.videoPlayer) {
        this.videoPlayer.pause();
        this.videoPlayer.src = "";
      }

      this.channelsSection.scrollIntoView({ behavior: "smooth" });
    }
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  if (typeof Hls === "undefined") {
    console.error("HLS.js library not loaded");
  }

  window.monPlayer = new MonPlayer();
});
