import { makeObservable, action, observable, computed, flowResult } from "mobx";
import type { GuideType, GuideStepType } from "../global/types";
import type { AxiosInstance } from "axios";

export interface CreateGuideRequest {
  title: string;
  description: string;
  steps: GuideStepType[];
  language: string;
  concepts: string[];
}

class CreateGuidePageStore {
  api: AxiosInstance | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  // Form fields
  title: string = "";
  description: string = "";
  language: string = "";
  concepts: string[] = [];
  steps: GuideStepType[] = [];

  currentStepIndex: number = 0;
  newConcept: string = "";

  constructor() {
    makeObservable(this, {
      isLoading: observable,
      error: observable,
      title: observable,
      description: observable,
      language: observable,
      concepts: observable,
      steps: observable,
      currentStepIndex: observable,
      newConcept: observable,
      setApi: action,
      setIsLoading: action,
      setError: action,
      setTitle: action,
      setDescription: action,
      setLanguage: action,
      setConcepts: action,
      setSteps: action,
      setCurrentStepIndex: action,
      setNewConcept: action,
      addConcept: action,
      removeConcept: action,
      addStep: action,
      removeStep: action,
      updateStep: action,
      moveStep: action,
      addAnnotationToStep: action,
      removeAnnotationFromStep: action,
      updateAnnotationInStep: action,
      resetForm: action,
      isFormValid: computed,
      canFetch: computed,
    });
  }

  setApi(newValue: AxiosInstance) {
    this.api = newValue;
  }

  setIsLoading(newValue: boolean) {
    this.isLoading = newValue;
  }

  setError(newValue: string | null) {
    this.error = newValue;
  }

  setTitle(newValue: string) {
    this.title = newValue;
  }

  setDescription(newValue: string) {
    this.description = newValue;
  }

  setLanguage(newValue: string) {
    this.language = newValue;
  }

  setConcepts(newValue: string[]) {
    this.concepts = newValue;
  }

  setSteps(newValue: GuideStepType[]) {
    this.steps = newValue;
  }

  setCurrentStepIndex(newValue: number) {
    this.currentStepIndex = newValue;
  }

  setNewConcept(newValue: string) {
    this.newConcept = newValue;
  }

  addConcept() {
    if (this.newConcept.trim() && !this.concepts.includes(this.newConcept.trim())) {
      this.concepts.push(this.newConcept.trim());
      this.newConcept = "";
    }
  }

  removeConcept(index: number) {
    this.concepts.splice(index, 1);
  }

  addStep() {
    const newStep: GuideStepType = {
      code: "",
      annotations: [],
    };
    this.steps.push(newStep);
    this.currentStepIndex = this.steps.length - 1;
  }

  removeStep(index: number) {
    this.steps.splice(index, 1);
    if (this.currentStepIndex >= this.steps.length) {
      this.currentStepIndex = Math.max(0, this.steps.length - 1);
    }
  }

  updateStep(index: number, field: keyof GuideStepType, value: any) {
    if (this.steps[index]) {
      this.steps[index] = { ...this.steps[index], [field]: value };
    }
  }

  moveStep(fromIndex: number, toIndex: number) {
    if (fromIndex >= 0 && fromIndex < this.steps.length && toIndex >= 0 && toIndex < this.steps.length) {
      const [movedStep] = this.steps.splice(fromIndex, 1);
      this.steps.splice(toIndex, 0, movedStep);
      this.currentStepIndex = toIndex;
    }
  }

  addAnnotationToStep(stepIndex: number) {
    if (this.steps[stepIndex]) {
      this.steps[stepIndex].annotations.push("");
    }
  }

  removeAnnotationFromStep(stepIndex: number, annotationIndex: number) {
    if (this.steps[stepIndex] && this.steps[stepIndex].annotations[annotationIndex] !== undefined) {
      this.steps[stepIndex].annotations.splice(annotationIndex, 1);
    }
  }

  updateAnnotationInStep(stepIndex: number, annotationIndex: number, value: string) {
    if (this.steps[stepIndex] && this.steps[stepIndex].annotations[annotationIndex] !== undefined) {
      this.steps[stepIndex].annotations[annotationIndex] = value;
    }
  }

  resetForm() {
    this.title = "";
    this.description = "";
    this.language = "";
    this.concepts = [];
    this.steps = [];
    this.currentStepIndex = 0;
    this.newConcept = "";
    this.error = null;
  }

  get isFormValid() {
    return (
      this.title.trim().length > 0 &&
      this.language.trim().length > 0 &&
      this.steps.length > 0 &&
      this.steps.every((step) => step.code.trim().length > 0)
    );
  }

  get canFetch() {
    return this.api !== null;
  }

  *createGuide(ownerId: string): Generator<Promise<GuideType | null>, Promise<GuideType | null>, GuideType | null> {
    if (!this.canFetch || !this.isFormValid || !this.api) return Promise.reject(null);

    this.setIsLoading(true);
    this.setError(null);

    const guideData: CreateGuideRequest = {
      title: this.title.trim(),
      description: this.description.trim(),
      language: this.language.trim(),
      concepts: this.concepts.filter((c) => c.trim().length > 0),
      steps: this.steps.map((step) => ({
        code: step.code.trim(),
        annotations: step.annotations.filter((a) => a.trim().length > 0),
      })),
    };

    console.log(this.api, "ALMOST");

    const result = yield this.api!.post("/guides/", { ...guideData, owner: ownerId })
      .then((res) => {
        const guide = res.data.data as GuideType;
        this.resetForm();
        return guide;
      })
      .catch((e) => {
        console.error(e);
        this.setError(e.response?.data?.message || "Failed to create guide");
        return null;
      })
      .finally(() => {
        this.setIsLoading(false);
      });

    return Promise.resolve(result);
  }

  async createGuideFlow(ownerId: string): Promise<GuideType | null> {
    const result = flowResult<GuideType | null>(await this.createGuide(ownerId).next().value);
    return result;
  }
}

export default CreateGuidePageStore;
