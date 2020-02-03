

public class Join {
	public static void main(String[] args) {
		//join();
		 // Book object on which wait and notify method will be called
		  Book book=new Book("The Alchemist");
		  BookReader johnReader=new BookReader(book);
		  BookReader arpitReader=new BookReader(book);
		  
		  // BookReader threads which will wait for completion of book
		  Thread johnThread=new Thread(johnReader,"John");
		  Thread arpitThread=new Thread(arpitReader,"Arpit");
		  
		  johnThread.start();
		  arpitThread.start();
		  
		  BookWriter bw = new BookWriter(book);
		  Thread tr =  new Thread(bw);
		  tr.start();
		  
	}

	private static void join() {
		System.out.println("My Main thread Starts here");
		Mythread my = new Mythread();
		Thread t1 = new Thread(my, "mythread1");
		Thread t2 = new Thread(my, "mythread2");
		Thread t3 = new Thread(my, "mythread3");

		t1.start();

		// lets waits for t1 to die
		try {

			t1.sleep(1000);
			// t1.wait();
			t1.join();
		} catch (InterruptedException e) {

			e.printStackTrace();
		}
		t2.start();
		try {
			// lets waits for 1 sec or t2 to die which ever occurs first
			t2.join(1000);

		} catch (InterruptedException e1) {

			e1.printStackTrace();
		}
		// Low priority Thread
		t3.setDaemon(true);
		t3.start();

		// complete all threads before completing main thread
		try {
			t2.join();
			t3.join();

		} catch (InterruptedException e1) {

			e1.printStackTrace();
		}
		System.out.println("Main thread execution ends");
	}
}

class Mythread implements Runnable {

	@Override
	public void run() {
		try {
			System.out.println(Thread.currentThread().getName() + " Start");
			// thread sleeps for 4 secs
			Thread.sleep(4000);
			System.out.println(Thread.currentThread().getName() + " end");
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}

class Book {

	String title;
	boolean isCompleted;

	public Book(String title) {
		super();
		this.title = title;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public boolean isCompleted() {
		return isCompleted;
	}

	public void setCompleted(boolean isCompleted) {
		this.isCompleted = isCompleted;
	}

}

class BookReader implements Runnable {

	Book book;

	public BookReader(Book book) {
		super();
		this.book = book;
	}

	@Override
	public void run() {
		synchronized (book) {
			System.out.println(
					Thread.currentThread().getName() + " is waiting for the book to be completed: " + book.getTitle());
			try {
				book.wait();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			System.out.println(Thread.currentThread().getName() + ": Book has been completed now!! you can read it");
		}
	}

}


class BookWriter implements Runnable{
	Book book;

	public BookWriter(Book book) {
		super();
		this.book = book;
	}
	@Override
	public void run() {
		synchronized (book) {
			book.notify();
			book.notifyAll();
		}
		
	}
	
}