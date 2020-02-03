package HackerRanker;

import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;
import java.util.Stack;

public class StackQueue {
	public static Stack<String> stacklist = new Stack<String>();
	public static Queue<String> q = new LinkedList<>();
	
	static void pushCharacter(char c) {
		stacklist.add(c+"");
	}
	static void enqueueCharacter(char c) {
		q.add(c+"");
	}
	static char popCharacter() {
		return stacklist.pop().charAt(0);
	}
	static char dequeueCharacter() {
		return q.poll().charAt(0);
	}
	
	 public static void main(String[] args) {
	        Scanner scan = new Scanner(System.in);
	        String input = scan.nextLine();
	        scan.close();

	        long[] l = new long[10];
	        // Convert input String to an array of characters:
	        char[] s = input.toCharArray();

	        // Create a Solution object:
	        StackQueue p = new StackQueue();

	        // Enqueue/Push all chars to their respective data structures:
	        for (char c : s) {
	            p.pushCharacter(c);
	            p.enqueueCharacter(c);
	        }

	        // Pop/Dequeue the chars at the head of both data structures and compare them:
	        boolean isPalindrome = true;
	        for (int i = 0; i < s.length/2; i++) {
	            if (p.popCharacter() != p.dequeueCharacter()) {
	                isPalindrome = false;                
	                break;
	                
	            }
	        }

	        //Finally, print whether string s is palindrome or not.
	        System.out.println( "The word, " + input + ", is " 
	                           + ( (!isPalindrome) ? "not a palindrome." : "a palindrome." ) );
	    }
}
