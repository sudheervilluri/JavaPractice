import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

public class LinkedList {

	private Node head;
	
	
	private static class Node{
		private String str ;
		private Node next;
		
		Node(String str){
			this.str = str;
		}
	}
	
	private void addLast(Node node) {
		if(head==null) {
			head = node;
		}else {
			Node temp = head;
			while(temp.next!=null) {
				temp = temp.next;
			}
				temp.next = node;
			
		}
	}
	public void printList(Node head) {
		Node temp = head;
		while (temp != null) {
			System.out.print(temp.str);
			temp = temp.next;
		}
		System.out.println();
	}
	
	public static Node reverseList(Node currentNode) {
		Node previousNode= null;
		Node NextNode;
		
		while(currentNode!=null) {
		NextNode = currentNode.next;
		currentNode.next = previousNode;
		previousNode = currentNode;
		currentNode = NextNode;
		}
		return previousNode;
		
	}
 
	public static void main(String[] args) {
//		LinkedList list = new LinkedList();
//		Node head = new Node("a");
//		list.addLast(head);
//		list.addLast(new Node("b"));
//		list.addLast(new Node("c"));
//		
//		list.printList(head);
//		Node reverseHead=reverseList(head);
//		System.out.println("After reversing");
//		list.printList(reverseHead);
//		
//		
//		Singleton str = Singleton.getInstance();
//		System.out.println(str);
//		

	//	LinkedList l = new LinkedList();
		ArrayList g = new ArrayList<>();
		
		g.add("test");
		g.add("test2");
		g.add("test3");
		ListIterator f = g.listIterator();
		while(f.hasNext()) {
		
			System.out.println(f.next());
			g.remove("test2");
		}
		
	}
}
