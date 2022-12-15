export type projectData = {
    name: string;
    desc?: string;
    apps: string[];
    targets: string[];
    excludePackages?: string[];
    includePackages?: string[];
    customRules?: string[];
    customLabels?: string[];
    advancedOptions?: advancedOptionsData;
};

export type advancedOptionsData = {
    targets?: string[];
    sources?: string[];
    excludeTags?: string[];
    additionalClasspath?: string;
    applicationName?: string;
    mavenizeGroupId?: string;
    ignorePath?: string;
    options?: string[];
};
