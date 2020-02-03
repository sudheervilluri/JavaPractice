package DataStructures;

/**
 * 
 * Full binary Tree : All node should have 0 or 2 nodes Complete Binary Tree :A
 * Binary Tree is complete Binary Tree if all levels are completely filled
 * except possibly the last level and the last level has all keys as left as
 * possible Perfect Binary Tree: A Binary tree is Perfect Binary Tree in which
 * all internal nodes have two children and all leaves are at the same level.
 * Following are examples of Perfect Binary Trees. Balanced Binary Tree A binary
 * tree: is balanced if the height of the tree is O(Log n) where n is the number
 * of nodes. For Example, AVL tree maintains O(Log n) height by making sure that
 * the difference between heights of left and right subtrees is atmost 1.
 * Red-Black trees maintain O(Log n) height by making sure that the number of
 * Black nodes on every root to leaf paths are same and there are no adjacent
 * red nodes. Balanced Binary Search trees are performance wise good as they
 * provide O(log n) time for search, insert and delete.
 *
 */

public class Trees {

	public static void main(String[] args) {
		TreeNode two = new TreeNode("2");
		TreeNode one = new TreeNode("1");
		TreeNode three = new TreeNode("3");
		two.left = one;
		two.right = three;

		postOrder(two);
		System.out.println("=============");
		postInOrder(two);
		System.out.println("=============");
		postOutOrder(two);
	}

	static void postOutOrder(TreeNode t) {
		if (t == null)
			return;
		postOrder(t.right);
		System.out.println(t.value);
		postOrder(t.left);
	}

	static void postOrder(TreeNode t) {
		if (t == null)
			return;
		postOrder(t.left);
		postOrder(t.right);
		System.out.println(t.value);
	}

	static void postInOrder(TreeNode t) {
		if (t == null)
			return;
		postOrder(t.left);
		System.out.println(t.value);
		postOrder(t.right);
	}

}

class TreeNode {
	String value;
	TreeNode right, left;

	public TreeNode(String value) {
		this.value = value;
		right = null;
		left = null;
	}
}