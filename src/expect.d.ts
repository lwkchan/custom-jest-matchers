declare namespace jest {
    interface Matchers {
        toContainReactElement<TProps>(component: ComponentType<TProps>, props?: TProps): CustomMatcherResult;
    }
}
