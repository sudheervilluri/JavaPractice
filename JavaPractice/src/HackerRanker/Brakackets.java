package HackerRanker;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;
import java.util.Stack;

/**
 * https://www.hackerrank.com/challenges/balanced-brackets/problem
 * 
 * @author SV065115
 *
 */
public class Brakackets {
	private static final Scanner scanner = new Scanner(System.in);

	public static void main(String[] args) throws IOException {
		BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter("OUTPUT_PATH"));

		int t = scanner.nextInt();
		scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

		for (int tItr = 0; tItr < t; tItr++) {
			String s = scanner.nextLine();

			String result = isBalanced(s);

			System.out.println(result);
			bufferedWriter.write(result);
			bufferedWriter.newLine();
		}

		bufferedWriter.close();

		scanner.close();
	}

	private static String isBalanced(String s) {
		Stack<Character> stack = new Stack<Character>();
		char[] c = s.toCharArray();
		for (char d : c) {
			if (d == '[' || d == '{' || d == '(') {
				stack.push(d);
			} else {
				if(stack.isEmpty()) {
					return "No";
				}
				Character ch = stack.pop();
				if ((ch == '[' && d != ']') || (ch == '(' && d != ')') || (ch == '{' && d != '}')) {
					return "No";
				}
				
			}
		}
		
		return stack.isEmpty() ? "No" : "Yes";
	}
}
