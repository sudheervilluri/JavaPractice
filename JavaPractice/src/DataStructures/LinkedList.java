package DataStructures;

public class LinkedList {
	static Node headNode;

	public static void main(String[] args) {
		headNode = new Node("1");
		Node two = new Node("2");
		Node three = new Node("3");
		Node four = new Node("4");

		headNode.next = two;
		two.next = three;
		headNode = push(headNode, four);
		delete(headNode, "3");

		while (headNode != null) {
			System.out.println(headNode.value);
			headNode = headNode.next;
		}

	}

	static Node push(Node headNode, Node newNode) {
		newNode.next = headNode;
		return newNode;
	}

	static void delete(Node headNode, String key) {
		// Store head node
		Node temp = headNode, prev = null;
		if (temp != null && temp.value == key) {
			headNode = temp.next; // Changed head
			return;
		}
		// Search for the key to be deleted, keep track of the
		// previous node as we need to change temp.next
		while (temp != null && temp.value != key) {
			prev = temp;
			temp = temp.next;
		}

		// If key was not present in linked list
		if (temp == null)
			return;

		// Unlink the node from linked list
		prev.next = temp.next;
	}

}

class Node {
	String value;
	Node next;

	public Node(String d) {
		this.value = d;
		next = null;
	}
}