export class Pagination {
    constructor(totalItems, currentPage = 1, itemsPerPage = 10, pageGroupSize = 10) {
      this.totalItems = totalItems;
      this.currentPage = currentPage;
      this.itemsPerPage = itemsPerPage;
      this.pageGroupSize = pageGroupSize;
    }
  
    get totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    }
  
    get currentGroup() {
      return Math.ceil(this.currentPage / this.pageGroupSize);
    }
  
    get startPage() {
      return (this.currentGroup - 1) * this.pageGroupSize + 1;
    }
  
    get endPage() {
      const end = this.currentGroup * this.pageGroupSize;
      return Math.min(end, this.totalPages);
    }
  
    get pages() {
      const pages = [];
      for (let i = this.startPage; i <= this.endPage; i++) {
        pages.push(i);
      }
      return pages;
    }
  
    get hasPreviousGroup() {
      return this.currentGroup > 1;
    }
  
    get hasNextGroup() {
      return this.currentGroup * this.pageGroupSize < this.totalPages;
    }
  
    getPreviousGroup() {
      return Math.max(this.startPage - this.pageGroupSize, 1);
    }
  
    getNextGroup() {
      return Math.min(this.endPage + 1, this.totalPages);
    }
  }