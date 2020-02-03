package HackerRanker;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;

/**
 * 
 * 1 4 1 3 4 10 5
 * 
 * Sample output 1 3 4 5 10
 * 
 * @author SV065115
 *
 */

public class DoubleLinkedList {

	static class DoublyLinkedListNode {
		public int data;
		public DoublyLinkedListNode next;
		public DoublyLinkedListNode prev;

		public DoublyLinkedListNode(int nodeData) {
			this.data = nodeData;
			this.next = null;
			this.prev = null;
		}
	}

	static class DoublyLinkedList {
		public DoublyLinkedListNode head;
		public DoublyLinkedListNode tail;

		public DoublyLinkedList() {
			this.head = null;
			this.tail = null;
		}

		public void insertNode(int nodeData) {
			DoublyLinkedListNode node = new DoublyLinkedListNode(nodeData);

			if (this.head == null) {
				this.head = node;
			} else {
				this.tail.next = node;
				node.prev = this.tail;
			}

			this.tail = node;
		}
	}

	public static void printDoublyLinkedList(DoublyLinkedListNode node, String sep, BufferedWriter bufferedWriter)
			throws IOException {
		while (node != null) {
			bufferedWriter.write(String.valueOf(node.data));
			System.out.println(String.valueOf(node.data));
			node = node.next;

			if (node != null) {

				bufferedWriter.write(sep);
			}
		}
	}

	// Complete the sortedInsert function below.

	/*
	 * For your reference:
	 *
	 * DoublyLinkedListNode { int data; DoublyLinkedListNode next;
	 * DoublyLinkedListNode prev; }
	 *
	 */
	static DoublyLinkedListNode SortedInsert(DoublyLinkedListNode head, int data) {
		DoublyLinkedListNode insert = new DoublyLinkedListNode(data);

		// List is empty
		if (head == null) {
			head = insert;
		}
		// Insert front
		else if (data < head.data) {
			insert.next = head;
			head.prev = insert;
			head = insert;
		}
		// Insert middle or end
		else {
			DoublyLinkedListNode current = head;
			// Iterate through list to find insertion point
			while (current.next != null && current.data < data) {
				current = current.next;
			} // Stops at end of list or just after insertion point

			// Insert before current
			if (data < current.data) {
				DoublyLinkedListNode previous = current.prev;

				// Create links to and from node before insertion point
				previous.next = insert;
				insert.prev = previous;
				// Create links to and from node after insertion point
				insert.next = current;
				current.prev = insert;
			}
			// Insert after current at end of list
			else {
				current.next = insert;
				insert.prev = current;
			}
		}

		return head;
	}

	static DoublyLinkedListNode reverse(DoublyLinkedListNode head) {
		DoublyLinkedListNode temp = head;
		DoublyLinkedListNode newHead = head;
		while (temp != null) {
			DoublyLinkedListNode prev = temp.prev;
			temp.prev = temp.next;
			temp.next = prev;
			newHead = temp;
			temp = temp.prev;
		}
		return newHead;
	}

	private static final Scanner scanner = new Scanner(System.in);

	public static void main(String[] args) throws IOException {
		BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter("OUTPUT_PATH"));

		int t = scanner.nextInt();
		scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

		for (int tItr = 0; tItr < t; tItr++) {
			DoublyLinkedList llist = new DoublyLinkedList();

			int llistCount = scanner.nextInt();
			scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

			for (int i = 0; i < llistCount; i++) {
				int llistItem = scanner.nextInt();
				scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

				llist.insertNode(llistItem);
			}

			int data = scanner.nextInt();
			scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

			DoublyLinkedListNode llist1 = SortedInsert(llist.head, data);

			printDoublyLinkedList(llist1, " ", bufferedWriter);
			bufferedWriter.newLine();
		}

		bufferedWriter.close();

		scanner.close();
	}
}
