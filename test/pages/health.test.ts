import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import HealthCheckPage from "@/pages/health.vue"; // adjust path if needed

vi.mock("@/configuration/ConfigLoader", () => ({
  loadConfig: () => ({
    devQuestBackend: { baseUrl: "http://localhost:8080" },
  }),
}));

describe("HealthCheckPage", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  it("displays backend health value on success", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => "healthy",
    });

    const wrapper = mount(HealthCheckPage);

    // Wait for the onMounted lifecycle to complete
    await new Promise((resolve) => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    expect(mockFetch).toHaveBeenCalledWith("http://localhost:8080/health");

    expect(wrapper.text()).toContain("Backend Health Check");
    expect(wrapper.text()).toContain("Value: healthy");
  });

  it("displays fallback message on fetch failure", async () => {
    mockFetch.mockRejectedValue(new Error("Network Error"));

    const wrapper = mount(HealthCheckPage);

    await new Promise((resolve) => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Loading or failed to fetch...");
  });

  it("displays fallback on non-OK response", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    const wrapper = mount(HealthCheckPage);

    await new Promise((resolve) => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Loading or failed to fetch...");
  });
});

describe("HealthCheckPage layout", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders title correctly", () => {
    const wrapper = mount(HealthCheckPage, {
      global: {
        stubs: {
          NuxtLayout: { template: "<div><slot /></div>" },
        },
      },
    });

    expect(wrapper.find("h1").text()).toBe("Backend Health Check");
  });

  it("renders loading message initially", () => {
    const wrapper = mount(HealthCheckPage, {
      global: {
        stubs: {
          NuxtLayout: { template: "<div><slot /></div>" },
        },
      },
    });

    expect(wrapper.text()).toContain("Loading or failed to fetch...");
  });

  it("renders json value if loaded", async () => {
    // This time we simulate a successful fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: "ok" }),
    });

    const wrapper = mount(HealthCheckPage, {
      global: {
        stubs: {
          NuxtLayout: { template: "<div><slot /></div>" },
        },
      },
    });

    // Wait for onMounted to resolve
    await new Promise((resolve) => setTimeout(resolve));

    expect(wrapper.text()).toContain('Value: {\n  "status": "ok"\n}')
  });

  it("renders error message if fetch fails", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Fetch failed"));

    const wrapper = mount(HealthCheckPage, {
      global: {
        stubs: {
          NuxtLayout: { template: "<div><slot /></div>" },
        },
      },
    });

    await new Promise((resolve) => setTimeout(resolve));

    expect(wrapper.text()).toContain("Loading or failed to fetch...");
  });
});
