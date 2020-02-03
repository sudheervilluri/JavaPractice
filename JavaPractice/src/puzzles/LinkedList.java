package puzzles;

public class LinkedList {
	public static void main(String[] args) {
		
		Node head = new Node(1);
		for (int i = 0; i < 5; i++) {
		insertNode(i, head);
		}
	}
	public static Node insertNode(int value,Node head){
		Node temp = head;
		while(temp.next!=null) {
			temp = temp.next;
		}
		temp.next = new Node(value);
		return head;
	}
	
}

class Node {
	Node(int i){
		this.value = i;
	}
	Node next;
	int value;
}