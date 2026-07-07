export class UnionFind {
  private readonly parent: number[];
  private readonly rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, index) => index);
    this.rank = Array.from({ length: size }, () => 0);
  }

  find(index: number): number {
    if (this.parent[index] !== index) {
      this.parent[index] = this.find(this.parent[index]);
    }

    return this.parent[index];
  }

  union(left: number, right: number): void {
    const leftRoot = this.find(left);
    const rightRoot = this.find(right);

    if (leftRoot === rightRoot) {
      return;
    }

    if (this.rank[leftRoot] < this.rank[rightRoot]) {
      this.parent[leftRoot] = rightRoot;
      return;
    }

    this.parent[rightRoot] = leftRoot;
    if (this.rank[leftRoot] === this.rank[rightRoot]) {
      this.rank[leftRoot] += 1;
    }
  }
}
