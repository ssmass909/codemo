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
      fetchGuidesFlow: action,
    });
  }

  *fetchGuides(userId: string): Generator<Promise<GuideType[]>, GuideType[], GuideType[]> {
    if (!this.api) return [] as GuideType[];
    const result = yield this.api!.get(`guides/user/${userId}`)
      .then((res) => res.data.data as GuideType[])
      .catch((e) => {
        console.error(e);
        return [];
      });

    return result;
  }

  async fetchGuidesFlow(userId: string): Promise<GuideType[]> {
    const result = await flowResult(this.fetchGuides(userId));
    this.setGuides(result);
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
