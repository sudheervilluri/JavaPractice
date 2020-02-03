package CoadingExam;

public class Solution3 {

	int carry = 0;
	ListNode head = null;
	ListNode prev = null;

	while(l1!=null||l2!=null||carry!=0)
	{
		int total = 0;

		if (l1 != null) {
			total = total + l1.val;
			l1 = l1.next;
		}
		if (l2 != null) {
			total = total + l2.val;
			l2 = l2.next;
		}
		total = total + carry;
		ListNode n = new ListNode(total % 10);
		carry = total / 10;

		if (prev != null) {
			prev.next = n;
		} else
			head = n;
		prev = n;
	}return head;
}

/**
 * Approach 1: Elementary Math Intuition
 * 
 * Keep track of the carry using a variable and simulate digits-by-digits sum
 * starting from the head of list, which contains the least-significant digit.
 * 
 * Illustration of Adding two numbers
 * 
 * Figure 1. Visualization of the addition of two numbers: 342 + 465 =
 * 807342+465=807. Each node contains a single digit and the digits are stored
 * in reverse order.
 * 
 * Algorithm
 * 
 * Just like how you would sum two numbers on a piece of paper, we begin by
 * summing the least-significant digits, which is the head of l1l1 and l2l2.
 * Since each digit is in the range of 0 \ldots 90…9, summing two digits may
 * "overflow". For example 5 + 7 = 125+7=12. In this case, we set the current
 * digit to 22 and bring over the carry = 1carry=1 to the next iteration.
 * carrycarry must be either 00 or 11 because the largest possible sum of two
 * digits (including the carry) is 9 + 9 + 1 = 199+9+1=19.
 * 
 * The pseudocode is as following:
 * 
 * Initialize current node to dummy head of the returning list. Initialize carry
 * to 00. Initialize pp and qq to head of l1l1 and l2l2 respectively. Loop
 * through lists l1l1 and l2l2 until you reach both ends. Set xx to node pp's
 * value. If pp has reached the end of l1l1, set to 00. Set yy to node qq's
 * value. If qq has reached the end of l2l2, set to 00. Set sum = x + y +
 * carrysum=x+y+carry. Update carry = sum / 10carry=sum/10. Create a new node
 * with the digit value of (sum \bmod 10)(summod10) and set it to current node's
 * next, then advance current node to next. Advance both pp and qq. Check if
 * carry = 1carry=1, if so append a new node with digit 11 to the returning
 * list. Return dummy head's next node. Note that we use a dummy head to
 * simplify the code. Without a dummy head, you would have to write extra
 * conditional statements to initialize the head's value.
 * 
 * Take extra caution of the following cases:
 **/