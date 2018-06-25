import java.util.LinkedList;

public class MovingTotal {
	/**
	 * Adds/appends list of integers at the end of internal list.
	 */
	LinkedList<Integer> myList = new LinkedList();

	public void append(int[] list) {

		for (int i : list) {

			int k = 0;
			for (int j = list.length; j > 0; j--) {
				if (this.myList.size() < 3) {
					myList.removeFirst();
					myList.addLast(list[k]);

				} else {
					this.myList.add(i);
				}
				k++;
			}

		}

	}

	/**
	 * Returns boolean representing if any three consecutive integers in the
	 * internal list have given total.
	 */
	public boolean contains(int total) {
		// throw new UnsupportedOperationException("Waiting to be implemented.");
		int sum = 0;
		for (Integer integer : this.myList) {
			sum += integer;
		}
		if (total == sum) {
			return true;
		}
		return false;

	}

	public static void main(String[] args) {
		MovingTotal movingTotal = new MovingTotal();

		movingTotal.append(new int[] { 1, 2, 3, 4 });

		System.out.println(movingTotal.contains(6));
		System.out.println(movingTotal.contains(9));

		movingTotal.append(new int[] { 6, 5 });

		System.out.println(movingTotal.contains(9));
	}
}