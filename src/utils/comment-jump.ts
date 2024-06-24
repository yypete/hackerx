const scrollToElement = (element: HTMLElement | null) => {
      if (element) {
        const rect = element.getBoundingClientRect();
        const offset = window.innerHeight / 2;
        window.scrollTo({
          top: rect.top + window.scrollY - offset,
          behavior: "smooth",
        });
      }
    };

    const findRootComment = (comment: Item): HTMLElement | null => {
      const rootElement = document.getElementById(`comment-${comment.id}`);
      if (rootElement) {
        let root = rootElement;
        while (
          root.parentElement &&
          !root.parentElement.id.startsWith("comment-")
        ) {
          root = root.parentElement;
        }
        return root;
      }
      return null;
    };

    const findParentComment = (comment: Item): HTMLElement | null => {
      const parent = document.getElementById(`comment-${comment.parent}`);
      return parent;
    };

    // 寻找当前评论项的下一个根评论
    const findNextSiblingComment = (comment: Item): HTMLElement | null => {
      const currentElement = document.getElementById(`comment-${comment.id}`);
      if (currentElement) {
        let sibling = currentElement.nextElementSibling;
        while (sibling) {
          if (sibling.id && sibling.id.startsWith("comment-")) {
            return sibling as HTMLElement;
          }
          sibling = sibling.nextElementSibling;
        }
      }
      return null;
    };

    const goToNextSibling = () => {
      const nextRootComment = findNextSiblingComment(props.comment);
      if (nextRootComment) {
        scrollToElement(nextRootComment);
      }
    };



    watchEffect(() => {
      rootComment.value = findRootComment(props.comment);
      parentComment.value = findParentComment(props.comment);
      nextSiblingComment.value = findNextSiblingComment(props.comment);
    });