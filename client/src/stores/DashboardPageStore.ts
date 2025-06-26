import { action, flow, flowResult, makeObservable, observable } from "mobx";
import type { GuideType } from "../global/types";
import type { AxiosInstance } from "axios";

class DashboardPageStore {
  guides: GuideType[] = [];
  api: AxiosInstance | null = null;

  constructor() {
    makeObservable(this, {
      guides: observable,
      fetchGuides: flow,
      setGuides: action,
      addGuide: action,
      filterGuides: action,
    });
  }

  *fetchGuides(userId: string): Generator<Promise<GuideType[]>, Promise<GuideType[]>, GuideType[]> {
    if (!this.api) return Promise.resolve([] as GuideType[]);
    const result = yield this.api!.get(`guides/user/${userId}`)
      .then((res) => {
        const guides = res.data.data as GuideType[];
        this.setGuides(guides);
        return guides;
      })
      .catch((e) => {
        console.error(e);
        return [];
      });

    return Promise.resolve(result);
  }

  async fetchGuidesFlow(userId: string): Promise<GuideType[]> {
    const result = flowResult<GuideType[]>(await this.fetchGuides(userId).next().value);
    return result;
  }

  setGuides(newValue: GuideType[]) {
    this.guides = newValue;
  }

  addGuide(newEntry: GuideType) {
    this.setGuides([...this.guides, newEntry]);
  }

  filterGuides(id?: string, pred?: (guide: GuideType) => boolean) {
    const filteredGuides = this.guides.filter((guide) => {
      let result = false;
      if (id && guide._id === id) result = true;
      if (pred && pred(guide)) result = true;
      return result;
    });
    this.setGuides(filteredGuides);
  }

  setApi(newValue: AxiosInstance) {
    this.api = newValue;
  }
}

export default DashboardPageStore;
