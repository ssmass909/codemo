import { type AxiosInstance } from "axios";
import { makeObservable, action, observable, computed, flowResult, flow } from "mobx";
import type { GuideType } from "../global/types";

class GuideDetailsPageStore {
  api: AxiosInstance | null = null;
  isLoading: boolean = false;
  isDeleting: boolean = false;
  error: string | null = null;
  guide: GuideType | null = null;

  // UI state
  currentStepIndex: number = 0;
  isEditMode: boolean = false;

  constructor() {
    makeObservable(this, {
      isLoading: observable,
      isDeleting: observable,
      error: observable,
      guide: observable,
      currentStepIndex: observable,
      isEditMode: observable,
      setIsLoading: action,
      setIsDeleting: action,
      setError: action,
      setGuide: action,
      setCurrentStepIndex: action,
      setIsEditMode: action,
      fetchGuide: flow,
      canFetch: computed,
      hasSteps: computed,
      currentStep: computed,
    });
  }

  setApi(newValue: AxiosInstance) {
    this.api = newValue;
  }

  setIsLoading(newValue: boolean) {
    this.isLoading = newValue;
  }

  setIsDeleting(newValue: boolean) {
    this.isDeleting = newValue;
  }

  setError(newValue: string | null) {
    this.error = newValue;
  }

  setGuide(newValue: GuideType | null) {
    this.guide = newValue;
    if (newValue) {
      this.currentStepIndex = 0;
    }
  }

  setCurrentStepIndex(newValue: number) {
    if (this.guide && newValue >= 0 && newValue < this.guide.steps.length) {
      this.currentStepIndex = newValue;
    }
  }

  setIsEditMode(newValue: boolean) {
    this.isEditMode = newValue;
  }

  nextStep() {
    if (this.guide && this.currentStepIndex < this.guide.steps.length - 1) {
      this.currentStepIndex++;
    }
  }

  previousStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
  }

  get canFetch() {
    return this.api !== null;
  }

  get hasSteps() {
    return this.guide && this.guide.steps.length > 0;
  }

  get currentStep() {
    if (this.guide && this.guide.steps[this.currentStepIndex]) {
      return this.guide.steps[this.currentStepIndex];
    }
    return null;
  }

  isOwner(userId: string | undefined) {
    if (!userId || !this.guide) return false;
    return this.guide.owner.toString() === userId;
  }

  *fetchGuide(guideId: string): Generator<Promise<GuideType | null>, GuideType | null, GuideType | null> {
    if (!this.canFetch) return null;

    this.setIsLoading(true);
    this.setError(null);
    const result = yield this.api!.get(`/guides/${guideId}`)
      .then((res) => res.data.data as GuideType)
      .catch((e) => {
        console.error(e);
        this.setError(e.response?.data?.message || "Failed to fetch guide");
        return null;
      })
      .finally(() => this.setIsLoading(false));

    return result;
  }

  async fetchGuideFlow(guideId: string): Promise<GuideType | null> {
    const result = await flowResult(this.fetchGuide(guideId));
    this.setGuide(result);
    return result;
  }

  *deleteGuide(guideId: string): Generator<Promise<boolean>, boolean, boolean> {
    if (!this.canFetch) return false;

    this.setIsDeleting(true);
    this.setError(null);

    const result = yield this.api!.delete(`/guides/${guideId}`)
      .then(() => {
        return true;
      })
      .catch((e) => {
        console.error(e);
        this.setError(e.response?.data?.message || "Failed to delete guide");
        return false;
      })
      .finally(() => {
        this.setIsDeleting(false);
      });

    return result;
  }

  async deleteGuideFlow(guideId: string): Promise<boolean> {
    const result = await flowResult(this.deleteGuide(guideId));
    return result;
  }

  reset() {
    this.guide = null;
    this.currentStepIndex = 0;
    this.isEditMode = false;
    this.error = null;
    this.isLoading = false;
    this.isDeleting = false;
  }
}

export default GuideDetailsPageStore;
